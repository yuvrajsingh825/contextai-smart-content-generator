import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, getUserProfile } from './services/firebaseService';

// Pages
import LandingPage from './pages/LandingPage';
import AuthPage from './pages/AuthPage';
import Dashboard from './pages/Dashboard';
import GeneratorPage from './pages/GeneratorPage';
import ProfilePage from './pages/ProfilePage';

// Components
import Navigation from './components/Navigation';
import CreatorTag from './components/CreatorTag';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = ({ user, loading, children }: { user: any, loading: boolean, children: React.ReactNode }) => {
  if (loading) return (
    <div className="h-full flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
    </div>
  );
  if (!user) return <Navigate to="/auth" />;
  return <>{children}</>;
};

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const userProfile = await getUserProfile(currentUser.uid);
          setProfile(userProfile);
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleContentGenerated = async () => {
    if (user) {
      const userProfile = await getUserProfile(user.uid);
      setProfile(userProfile);
    }
  };

  return (
    <Router>
      <div className="h-screen flex flex-col bg-[#020617] text-slate-100 selection:bg-blue-500/30 font-sans relative overflow-hidden">
        {/* Background Blobs */}
        <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-600/10 blur-[120px]"></div>
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-600/5 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex flex-col h-full">
          <Navigation user={user} profile={profile} />
          <main className="flex-1 overflow-y-auto custom-scrollbar px-4 sm:px-6 lg:px-8 py-8">
            <div className="max-w-7xl mx-auto h-full">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={user ? <Navigate to="/studio" /> : <AuthPage />} />
                <Route path="/dashboard" element={<ProtectedRoute user={user} loading={loading}><Dashboard user={user} profile={profile} /></ProtectedRoute>} />
                <Route path="/command" element={<Navigate to="/dashboard" />} />
                <Route path="/studio" element={
                  <ProtectedRoute user={user} loading={loading}>
                    <GeneratorPage user={user} profile={profile} onContentGenerated={handleContentGenerated} />
                  </ProtectedRoute>
                } />
                <Route path="/generate" element={<Navigate to="/studio" />} />
                <Route path="/profile" element={<ProtectedRoute user={user} loading={loading}><ProfilePage user={user} profile={profile} /></ProtectedRoute>} />
              </Routes>
            </div>
            <CreatorTag />
          </main>
        </div>
      </div>
    </Router>
  );
}
