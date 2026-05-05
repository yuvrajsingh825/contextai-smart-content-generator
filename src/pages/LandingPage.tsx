import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, BarChart3, ArrowRight, CheckCircle2, PenTool, Layout, Hash, Type, Bell, Send, FileUser, Linkedin, Instagram, Heart, Mail, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';
import { db } from '../services/firebaseService';
import { addDoc, collection } from 'firebase/firestore';

const CONTENT_TYPES = [
  { label: 'SEO Blog Post', icon: Layout, color: 'from-blue-500/20 to-blue-600/5', border: 'border-blue-500/20', text: 'text-blue-400' },
  { label: 'LinkedIn Post', icon: Linkedin, color: 'from-sky-500/20 to-sky-600/5', border: 'border-sky-500/20', text: 'text-sky-400' },
  { label: 'Instagram Caption', icon: Instagram, color: 'from-pink-500/20 to-pink-600/5', border: 'border-pink-500/20', text: 'text-pink-400' },
  { label: 'Resume Summary', icon: FileUser, color: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', text: 'text-emerald-400' },
  { label: 'Ad Copy', icon: Hash, color: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', text: 'text-purple-400' },
  { label: 'YouTube Script', icon: Bell, color: 'from-red-500/20 to-red-600/5', border: 'border-red-500/20', text: 'text-red-400' },
  { label: 'Twitter Thread', icon: Hash, color: 'from-cyan-500/20 to-cyan-600/5', border: 'border-cyan-500/20', text: 'text-cyan-400' },
  { label: 'Cold Email', icon: Send, color: 'from-violet-500/20 to-violet-600/5', border: 'border-violet-500/20', text: 'text-violet-400' },
  { label: 'Email Sequence', icon: Type, color: 'from-indigo-500/20 to-indigo-600/5', border: 'border-indigo-500/20', text: 'text-indigo-400' },
  { label: 'Product Description', icon: PenTool, color: 'from-orange-500/20 to-orange-600/5', border: 'border-orange-500/20', text: 'text-orange-400' },
];

export default function LandingPage() {
  const [feedback, setFeedback] = useState({ name: '', email: '', message: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const handleFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.message.trim()) return;
    setFeedbackLoading(true);
    try {
      await addDoc(collection(db, 'feedback'), {
        ...feedback,
        submittedAt: new Date().toISOString(),
      });
      setFeedbackSent(true);
      setFeedback({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Feedback error:', err);
    } finally {
      setFeedbackLoading(false);
    }
  };

  return (
    <div className="pb-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
        <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 10, repeat: Infinity }} className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full" />
        <motion.div animate={{ y: [0, -30, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute bottom-1/4 right-[10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      {/* Hero */}
      <section className="text-center pt-20 mb-24 px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-10 backdrop-blur-xl">
            <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
            ⚡ Powered by LLaMA 3.3 70B via Groq
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">Stop Thinking.</span>
            <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-[#4F46E5] via-[#7C3AED] to-[#9333EA] bg-clip-text text-transparent">Start Creating.</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            Write blogs, ads, YouTube scripts, Twitter threads and more instantly using AI.
            <span className="text-white font-semibold"> No skills needed. 100% free.</span>
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link to="/auth" className="relative group w-full sm:w-auto overflow-hidden px-10 py-5 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-black text-sm uppercase tracking-widest shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:shadow-[0_25px_60px_rgba(147,51,234,0.6)] hover:-translate-y-0.5 transition-all flex items-center justify-center gap-3">
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.15),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Sparkles className="w-4 h-4" />
              Start Creating Free
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/studio" className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all flex items-center justify-center gap-3 group">
              Try Demo <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-white group-hover:translate-x-1 transition-all" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-slate-500 font-black uppercase tracking-[0.15em]">
            {['50 Free Daily Credits', 'No Credit Card', 'Instant Access', 'Google Sign-In'].map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </motion.div>

        {/* Code Mockup */}
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 1 }} className="mt-24 relative px-4">
          <div className="max-w-4xl mx-auto rounded-[3rem] p-4 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl">
            <div className="aspect-video bg-[#020617]/90 rounded-[2rem] border border-white/5 overflow-hidden flex flex-col p-8 relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/5 to-purple-600/5" />
              <div className="flex gap-2 mb-6 border-b border-white/5 pb-4 z-10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                <span className="ml-4 text-[10px] text-slate-600 uppercase tracking-widest font-mono">contextai • studio.ts</span>
              </div>
              <div className="font-mono text-xs text-slate-400 z-10">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }} className="text-slate-600 italic mb-3">
                  {'// 🤖 Neural synthesis engine initialized...'}
                </motion.div>
                <motion.div initial={{ width: 0 }} animate={{ width: '100%' }} transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5 }} className="overflow-hidden whitespace-nowrap border-r-2 border-indigo-500 mb-6">
                  <span className="text-purple-400">const</span> <span className="text-blue-400">result</span> <span className="text-slate-300">= await</span> <span className="text-yellow-200">ContextAI</span><span className="text-slate-300">.</span><span className="text-blue-300">generate</span><span className="text-slate-300">{'({ type: '}</span><span className="text-emerald-400">'blog'</span><span className="text-slate-300">{', topic: '}</span><span className="text-emerald-400">'Future of AI'</span><span className="text-slate-300">{' });'}</span>
                </motion.div>
                <div className="bg-[#0f172a] p-5 rounded-2xl border border-indigo-500/20">
                  <motion.p animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 3, repeat: Infinity }} className="text-indigo-100 text-sm leading-relaxed">
                    "Artificial Intelligence is not just a tool — it's a fundamental shift in how creativity scales. ContextAI turns complex ideas into publish-ready content in seconds..."
                  </motion.p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Content Types */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">10 Content Types. One Platform.</h2>
          <p className="text-slate-500 font-medium">Everything a creator, marketer, or student needs — powered by the same AI engine.</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {CONTENT_TYPES.map((ct, i) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              whileHover={{ scale: 1.05, y: -4 }}
              className={cn('p-5 rounded-3xl bg-gradient-to-br border text-center group cursor-default transition-all', ct.color, ct.border)}>
              <ct.icon className={cn('w-6 h-6 mx-auto mb-3 group-hover:scale-110 transition-transform', ct.text)} />
              <p className={cn('text-[9px] font-black uppercase tracking-widest', ct.text)}>{ct.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-10">
          <Link to="/auth" className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:-translate-y-0.5 transition-all shadow-[0_10px_30px_rgba(79,70,229,0.3)]">
            <Sparkles className="w-4 h-4" /> Try All Free
          </Link>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-6 mb-32">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">How it Works</h2>
          <p className="text-slate-500 font-medium">Three steps from idea to publish-ready content.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Pick Your Blueprint', desc: 'Choose from 10 content types — blog, ad, tweet, script, and more.', icon: Layout, color: 'text-blue-400' },
            { step: '02', title: 'Describe Your Idea', desc: 'Type a topic, tone, and keywords. Our AI handles the heavy lifting.', icon: PenTool, color: 'text-purple-400' },
            { step: '03', title: 'Copy & Publish', desc: 'Get beautifully formatted output. Download as PDF or copy in one click.', icon: Zap, color: 'text-emerald-400' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
              className="relative group p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all">
              <div className="text-7xl font-black text-white/[0.03] absolute -top-6 -left-2 select-none">{item.step}</div>
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <item.icon className={cn('w-5 h-5', item.color)} />
              </div>
              <h3 className="text-lg font-black mb-3 text-white">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto px-6 mb-32">
        {[
          { title: 'LLaMA 3.3 70B Powered', desc: "Groq's ultra-fast LLaMA 3.3 — ChatGPT-level quality, delivered in seconds.", icon: BarChart3, color: 'text-blue-500', glow: 'from-blue-500/20' },
          { title: 'Multi-Channel Ready', desc: 'From Twitter threads to 2000-word blogs. 10 content types in one platform.', icon: Zap, color: 'text-orange-500', glow: 'from-orange-500/20' },
          { title: 'Secure & Private', desc: 'Firebase-powered auth with Google Sign-In. Your data stays yours.', icon: Shield, color: 'text-emerald-500', glow: 'from-emerald-500/20' },
        ].map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[2.5rem] bg-white/[0.02] border border-white/5 group hover:border-white/10 transition-all">
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform relative overflow-hidden">
              <div className={cn('absolute inset-0 opacity-20 blur-xl bg-gradient-to-br', f.glow)} />
              <f.icon className={cn('w-6 h-6 relative z-10', f.color)} />
            </div>
            <h3 className="text-xl font-black mb-3 text-white">{f.title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* About / Mission */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="p-12 rounded-[3rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-white mb-4">Our Mission</h2>
          <p className="text-slate-400 leading-relaxed max-w-2xl mx-auto font-medium">
            ContextAI was built by a student who wanted powerful AI tools to be accessible to everyone — not just big companies. We believe every creator, founder, and marketer deserves world-class AI assistance for free.
          </p>
          <p className="text-slate-600 text-sm mt-4 font-medium">
            Built with ❤️ by Yuvraj Singh · Powered by Groq + Firebase + Vercel
          </p>
        </motion.div>
      </section>

      {/* Early Adopter CTA — honest, no fake numbers */}
      <section className="max-w-4xl mx-auto px-6 mb-32">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="relative p-16 rounded-[3rem] bg-gradient-to-br from-[#4F46E5]/20 to-[#9333EA]/20 border border-indigo-500/20 text-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 blur-3xl" />
          <div className="relative z-10">
            <p className="text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">🚀 Early Access</p>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Be Among the First</h2>
            <p className="text-slate-400 mb-10 font-medium">ContextAI is growing. Join early, share your feedback, and help shape what we build next.</p>
            <Link to="/auth" className="inline-flex items-center gap-3 px-12 py-5 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-1 transition-all shadow-[0_20px_50px_rgba(79,70,229,0.4)]">
              <Sparkles className="w-5 h-5" />
              Get Started — It's Free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Contact / Feedback Form */}
      <section className="max-w-2xl mx-auto px-6 mb-24" id="feedback">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-black text-white mb-3">Share Your Feedback</h2>
          <p className="text-slate-500 text-sm font-medium">We read every message. Help us build something great.</p>
        </div>
        {feedbackSent ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="p-10 rounded-[2rem] bg-emerald-500/10 border border-emerald-500/20 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">Thank you!</h3>
            <p className="text-slate-400 text-sm">Your feedback has been received. We'll use it to improve ContextAI.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleFeedback} className="space-y-4 p-8 rounded-[2rem] bg-white/[0.02] border border-white/5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input value={feedback.name} onChange={e => setFeedback(p => ({ ...p, name: e.target.value }))}
                placeholder="Your name (optional)" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all" />
              <input value={feedback.email} onChange={e => setFeedback(p => ({ ...p, email: e.target.value }))}
                type="email" placeholder="Email (optional)" className="bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all" />
            </div>
            <textarea required value={feedback.message} onChange={e => setFeedback(p => ({ ...p, message: e.target.value }))}
              rows={4} placeholder="What do you think about ContextAI? Any features you'd love to see?"
              className="w-full bg-white/[0.03] border border-white/10 rounded-2xl p-4 text-sm text-white placeholder:text-slate-700 focus:outline-none focus:border-indigo-500 transition-all resize-none" />
            <button type="submit" disabled={feedbackLoading}
              className="w-full py-4 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:-translate-y-0.5 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
              <MessageSquare className="w-4 h-4" />
              {feedbackLoading ? 'Sending...' : 'Send Feedback'}
            </button>
          </form>
        )}
      </section>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto px-6 pt-12 border-t border-white/5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2 text-slate-600 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>© 2026 ContextAI — Built by Yuvraj Singh</span>
          </div>
          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-600">
            <Link to="/studio" className="hover:text-white transition-colors">AI Studio</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link to="/auth" className="hover:text-white transition-colors">Sign In</Link>
            <a href="#feedback" className="hover:text-white transition-colors">Feedback</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
