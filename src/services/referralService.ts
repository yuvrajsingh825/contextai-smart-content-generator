import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from './firebaseService';

const APP_URL = 'https://contextai-smart-content-generator.vercel.app';

/**
 * Get or create a referral record for a user.
 * Returns the user's unique referral link.
 */
export async function getOrCreateReferralLink(userId: string): Promise<string> {
  const refDoc = doc(db, 'referrals', userId);
  const snap = await getDoc(refDoc);

  if (!snap.exists()) {
    await setDoc(refDoc, {
      userId,
      referralCount: 0,
      createdAt: new Date().toISOString(),
    });
  }

  return `${APP_URL}/?ref=${userId}`;
}

/**
 * Get how many users signed up via this user's referral link.
 */
export async function getReferralCount(userId: string): Promise<number> {
  const refDoc = doc(db, 'referrals', userId);
  const snap = await getDoc(refDoc);
  if (!snap.exists()) return 0;
  return snap.data()?.referralCount || 0;
}

/**
 * Called when a new user signs up — credit the referrer if ?ref= param exists.
 */
export async function processReferral(newUserId: string): Promise<void> {
  const params = new URLSearchParams(window.location.search);
  const referrerId = params.get('ref');

  if (!referrerId || referrerId === newUserId) return;

  try {
    // Check if this new user was already attributed to a referrer
    const attributionDoc = doc(db, 'referral_attributions', newUserId);
    const existing = await getDoc(attributionDoc);
    if (existing.exists()) return; // Already attributed

    // Credit the referrer
    const refDoc = doc(db, 'referrals', referrerId);
    await updateDoc(refDoc, { referralCount: increment(1) });

    // Mark attribution so we don't double-count
    await setDoc(attributionDoc, {
      newUserId,
      referrerId,
      attributedAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Referral processing error:', err);
  }
}

/**
 * Build pre-filled share messages for each platform.
 */
export function getShareMessages(refLink: string) {
  const msg = `Check out ContextAI 🚀 — a free AI tool that writes blogs, LinkedIn posts, YouTube scripts & more in seconds!\n\n${refLink}`;

  return {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(msg)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(msg)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(refLink)}&summary=${encodeURIComponent('Free AI content generator — try ContextAI!')}`,
    copy: refLink,
  };
}
