import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, ArrowRight, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';
import Logo from '../components/Logo';
import { signInWithGoogle } from '../services/firebaseService';

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: Math.random() * 4 + 2,
  x: Math.random() * 100,
  y: Math.random() * 100,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}));

export default function AuthPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      navigate('/studio');
    } catch (err: any) {
      console.error("Full Auth Error:", err);
      let errorMessage = 'Authentication failed. Please try again.';
      try {
        const parsed = JSON.parse(err.message);
        errorMessage = parsed.error || errorMessage;
      } catch (e) {
        errorMessage = err.message || errorMessage;
      }
      setError(`${errorMessage}`);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 relative overflow-hidden">
      {/* Animated particles */}
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          animate={{ y: [0, -30, 0], opacity: [0.2, 0.6, 0.2] }}
          transition={{ duration: p.duration, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          className="absolute rounded-full bg-indigo-500/30 blur-sm pointer-events-none"
          style={{ width: p.size, height: p.size, left: `${p.x}%`, top: `${p.y}%` }}
        />
      ))}

      {/* Background glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-purple-600/10 blur-[100px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-md w-full relative z-10"
      >
        {/* Gradient border glow card */}
        <div className="relative rounded-[2.5rem] p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/20 to-transparent shadow-[0_0_60px_rgba(79,70,229,0.2)]">
          <div className="bg-[#080f1e] p-10 rounded-[calc(2.5rem-1px)] relative overflow-hidden text-center">
            {/* Top glare line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
            {/* Inner glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full pointer-events-none" />

            {/* Logo */}
            <div className="flex justify-center mb-8 relative z-10">
              <Logo size="lg" withText={false} />
            </div>

            <h2 className="text-3xl font-black text-white tracking-tight mb-2 relative z-10">Welcome Back</h2>
            <p className="text-slate-500 text-sm font-medium mb-8 relative z-10">Sign in to access your AI Studio.</p>

            {/* Error */}
            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-left relative z-10">
                ⚠️ {error}
              </motion.div>
            )}

            {/* Google Button */}
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-between px-6 py-4 rounded-2xl bg-white text-slate-900 font-bold hover:bg-slate-100 transition-all active:scale-[0.98] disabled:opacity-70 group relative z-10 shadow-lg"
            >
              <div className="flex items-center gap-3">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                ) : (
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                <span className="font-black text-sm">{loading ? 'Authenticating...' : 'Continue with Google'}</span>
              </div>
              {!loading && <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-slate-700 group-hover:translate-x-1 transition-all" />}
            </button>

            {/* Feature bullets */}
            <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-3 relative z-10">
              {[
                { icon: Zap, label: '50 Free Credits', color: 'text-emerald-400' },
                { icon: Shield, label: 'No Credit Card', color: 'text-blue-400' },
                { icon: Sparkles, label: 'Instant Access', color: 'text-purple-400' },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                  <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Bottom note */}
            <p className="mt-6 text-[10px] text-slate-700 relative z-10">
              By signing in, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
