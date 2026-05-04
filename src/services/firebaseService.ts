import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut,
  User
} from "firebase/auth";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc, 
  increment,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  addDoc,
  Timestamp,
  serverTimestamp,
  type DocumentData
} from "firebase/firestore";
import { initializeApp } from "firebase/app";

// We'll import the config from the generated file later
// For now, we'll use a placeholder or wait for the system to create it
// Since we called set_up_firebase, the file will be firebase-applet-config.json
import firebaseConfig from "../../firebase-applet-config.json";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

const googleProvider = new GoogleAuthProvider();

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    
    // Initialize user profile in Firestore if it doesn't exist
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      await setDoc(userRef, {
        name: user.displayName,
        email: user.email,
        freeCredits: 50,
        paidCredits: 0,
        lastCreditReset: serverTimestamp(),
        plan: "free",
        createdAt: serverTimestamp(),
      });
    }
    
    return user;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "users");
    throw error;
  }
}

export async function logOut() {
  await signOut(auth);
}

export async function getUserProfile(uid: string) {
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    const lastReset = data.lastCreditReset?.toDate() || new Date(0);
    const now = new Date();

    // Migration and Reset Logic
    const isNewDay = now.setHours(0,0,0,0) > lastReset.setHours(0,0,0,0);
    const needsMigration = data.freeCredits === undefined || data.paidCredits === undefined || data.plan === undefined;

    if (isNewDay || needsMigration) {
      const updatedData: any = {
        lastCreditReset: serverTimestamp()
      };
      
      if (isNewDay || data.freeCredits === undefined) updatedData.freeCredits = 50;
      if (data.paidCredits === undefined) updatedData.paidCredits = data.credits || 0;
      if (data.plan === undefined) updatedData.plan = "free";
      
      try {
        await updateDoc(userRef, updatedData);
        return { ...data, ...updatedData };
      } catch (updateError) {
        handleFirestoreError(updateError, OperationType.UPDATE, `users/${uid}`);
      }
    }

    return data;
  } catch (error) {
    if (error instanceof Error && error.message.includes('OperationType')) throw error;
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
  }
}

export async function saveGeneratedContent(uid: string, type: string, input: any, output: string) {
  const contentRef = collection(db, "contents");
  try {
    await addDoc(contentRef, {
      userId: uid,
      type,
      input,
      output,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, "contents");
  }
  
  // Deduct credits: Prefer free credits first
  try {
    const userRef = doc(db, "users", uid);
    const userDoc = await getDoc(userRef);
    const data = userDoc.data();
    
    if (!data) return;

    const cost = 5;
    let freeCredits = data.freeCredits || 0;
    let paidCredits = data.paidCredits || 0;

    if (freeCredits >= cost) {
      freeCredits -= cost;
    } else {
      const remainder = cost - freeCredits;
      freeCredits = 0;
      paidCredits = Math.max(0, paidCredits - remainder);
    }

    await updateDoc(userRef, {
      freeCredits,
      paidCredits
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${uid}`);
  }
}

export async function getContentHistory(uid: string) {
  const contentRef = collection(db, "contents");
  const q = query(
    contentRef, 
    where("userId", "==", uid), 
    orderBy("createdAt", "desc")
  );
  try {
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, "contents");
  }
}
