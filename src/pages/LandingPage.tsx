import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Sparkles, Zap, Shield, BarChart3, ArrowRight, CheckCircle2 } from 'lucide-react';
import { cn } from '../lib/utils';

export default function LandingPage() {
  const features = [
    {
      title: "SEO Optimized",
      description: "Generate content that ranks. Our AI understands search intent and keyword density.",
      icon: BarChart3,
      color: "text-blue-500"
    },
    {
      title: "Multi-Channel",
      description: "From Facebook ads to 2000-word blog posts, we cover every marketing angle.",
      icon: Zap,
      color: "text-orange-500"
    },
    {
      title: "Enterprise Grade",
      description: "Secure, fast, and scalable. Built on top of Google's most advanced Gemini models.",
      icon: Shield,
      color: "text-emerald-500"
    }
  ];

  return (
    <div className="pt-20 pb-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-0 left-[10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, -30, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-1/4 right-[10%] w-[600px] h-[600px] bg-purple-600/10 blur-[150px] rounded-full"
        />
      </div>

      {/* Hero Section */}
      <section className="text-center mb-32 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto"
        >
          {/* Badge */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 mb-10 backdrop-blur-xl shadow-xl shadow-blue-500/5 hover:border-blue-500/30 transition-colors"
          >
            <span className="flex h-1.5 w-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
            🚀 Powered by AI
          </motion.div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 leading-[1.1] bg-gradient-to-r from-blue-400 via-indigo-600 to-cyan-400 bg-clip-text text-transparent">
            Stop Thinking. <br className="hidden md:block" /> Start Creating.
          </h1>

          <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-14 font-medium leading-relaxed">
            Write blogs, ads, and social content instantly using AI — no skills needed. 
            Built for creators who want speed and clarity.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-16">
            <Link
              to="/studio"
              className="relative group w-full sm:w-auto overflow-hidden px-10 py-5 bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(79,70,229,0.3)] hover:shadow-[0_25px_60px_rgba(147,51,234,0.5)] active:scale-95 flex items-center justify-center gap-3"
            >
              <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              Start Creating
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            
            <Link
              to="/studio"
              className="w-full sm:w-auto px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-3 group active:scale-95"
            >
              Try Demo
              <Sparkles className="w-4 h-4 text-purple-400 group-hover:rotate-12 transition-transform" />
            </Link>
          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex items-center justify-center gap-4 text-[10px] text-slate-600 font-black uppercase tracking-[0.2em]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              50 Daily Credits
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-800" />
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              No Credit Card
            </div>
          </motion.div>
        </motion.div>

        {/* Floating Mockup Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="mt-32 relative px-4"
        >
          <div className="max-w-5xl mx-auto rounded-[3rem] p-4 bg-gradient-to-b from-white/10 to-transparent border border-white/10 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
             <div className="aspect-video bg-[#020617]/90 rounded-[2rem] border border-white/5 overflow-hidden flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/5 via-transparent to-purple-600/5" />
                <div className="text-slate-400 font-mono text-[11px] sm:text-xs leading-[1.8] select-none group-hover:text-slate-300 transition-colors p-12 text-left w-full h-full z-10 flex flex-col">
                  <div className="flex gap-2 mb-8 items-center border-b border-white/5 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/80 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                    <span className="ml-4 text-[10px] text-slate-600 uppercase tracking-widest">studio.ts</span>
                  </div>
                  
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                    className="mb-2 text-slate-500 italic"
                  >
                    {"// Initializing neural synthesis engine..."}
                  </motion.div>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                    className="overflow-hidden whitespace-nowrap border-r-2 border-indigo-500 mb-8 font-medium"
                  >
                    <span className="text-purple-400">const</span> <span className="text-blue-400">content</span> <span className="text-slate-300">=</span> <span className="text-purple-400">await</span> <span className="text-yellow-200">ContextAI</span><span className="text-slate-300">.</span><span className="text-blue-300">generate</span><span className="text-slate-300">({'{'}</span> <span className="text-slate-400">topic:</span> <span className="text-emerald-400">'Future of AI'</span> <span className="text-slate-300">{'}'});</span>
                  </motion.div>
                  
                  <div className="mt-auto relative">
                    <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl opacity-50" />
                    <div className="relative text-indigo-100 break-words line-clamp-6 bg-[#0f172a] p-6 rounded-2xl border border-indigo-500/20 shadow-xl">
                      <motion.div
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      >
                        {"\"Artificial Intelligence is not just a tool—it's a fundamental shift in how human creativity scales. The ability to turn complex concepts into viral narratives in seconds is the new distribution superpower. By leveraging neural networks...\""}
                      </motion.div>
                    </div>
                  </div>
                </div>
             </div>
             {/* Glowing accent inside the mockup */}
             <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000" />
          </div>
          {/* Decorative background glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] bg-blue-600/5 blur-[150px] -z-10 pointer-events-none rounded-full" />
        </motion.div>
      </section>

      {/* How it Works */}
      <section className="max-w-6xl mx-auto px-6 mb-40">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">How it Works</h2>
          <p className="text-slate-500 font-medium">Three steps to content mastery.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            { step: "01", title: "Enter Your Idea", desc: "Just point our AI in the right direction with a topic or keyword." },
            { step: "02", title: "AI Generation", desc: "Our intelligent engine creates high-quality copy in seconds." },
            { step: "03", title: "Scale & Publish", desc: "Copy, download, or publish directly to your channels." }
          ].map((item, i) => (
            <div key={i} className="relative group">
              <div className="text-6xl font-black text-white/5 absolute -top-10 -left-4 group-hover:text-blue-500/10 transition-colors">{item.step}</div>
              <div className="relative z-10 p-8 rounded-3xl bg-white/[0.02] border border-white/5 hover:border-blue-500/20 transition-all">
                <h3 className="text-xl font-bold mb-3 text-white">{item.title}</h3>
                <p className="text-slate-500 leading-relaxed text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto px-6">
        {features.map((feature, i) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[2.5rem] glass-card glass-card-hover group border border-white/5"
          >
            <div className={`w-14 h-14 rounded-2xl bg-slate-900 border border-white/5 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:border-blue-500/30 transition-all shadow-2xl relative overflow-hidden`}>
              <div className={cn("absolute inset-0 opacity-10 blur-xl", feature.color.replace('text-', 'bg-'))} />
              <feature.icon className={cn("w-6 h-6 relative z-10", feature.color)} />
            </div>
            <h3 className="text-xl font-black mb-4 uppercase tracking-tight">{feature.title}</h3>
            <p className="text-[13px] text-slate-500 leading-relaxed font-bold">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </section>
      {/* Social Proof */}
      <section className="mt-40 text-center border-t border-zinc-900 pt-20">
        <p className="text-zinc-500 text-sm uppercase tracking-widest font-semibold mb-12">Trusted by builders at</p>
        <div className="flex flex-wrap justify-center items-center gap-12 opacity-30 grayscale hover:opacity-100 hover:grayscale-0 transition-all duration-700">
           {['Supabase', 'Vercel', 'Linear', 'Github', 'Stripe'].map(name => (
             <span key={name} className="text-2xl font-bold tracking-tighter text-white">{name}</span>
           ))}
        </div>
      </section>
    </div>
  );
}
