import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Github, User } from 'lucide-react';

export default function CreatorTag() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1 }}
      className="fixed bottom-6 right-6 z-[100] group pointer-events-auto"
    >
      <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/5 bg-slate-900/60 backdrop-blur-md transition-all shadow-2xl relative overflow-hidden">
        {/* Subtle Shine Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine pointer-events-none" />
        
        <div className="flex items-center gap-2 pr-2 border-r border-white/10 shrink-0">
          <div className="w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
            <User className="w-2.5 h-2.5 text-blue-400" />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
            Built by <span className="text-slate-300">Yuvraj Singh Tomar</span>
          </p>
        </div>

        <div className="flex items-center gap-3 pl-1">
          <a
            href="https://www.linkedin.com/in/yuvraj-singh-tomar-"
            target="_blank"
            rel="noopener noreferrer"
            title="LinkedIn Profile"
            className="text-slate-500 hover:text-blue-400 transition-colors"
          >
            <Linkedin className="w-3.5 h-3.5" />
          </a>
          <a
            href="https://github.com/yuvrajsingh825"
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub Profile"
            className="text-slate-500 hover:text-white transition-colors"
          >
            <Github className="w-3.5 h-3.5" />
          </a>
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 rounded-lg bg-slate-910 border border-white/10 text-[10px] font-bold text-slate-300 whitespace-nowrap opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all pointer-events-none shadow-xl">
          Creator of this platform
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
        </div>
      </div>
    </motion.div>
  );
}
