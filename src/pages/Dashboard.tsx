import React, { useEffect, useState } from 'react';
import { getContentHistory } from '../services/firebaseService';
import { motion, AnimatePresence } from 'motion/react';
import { 
  History, 
  Trash2, 
  Copy, 
  Check, 
  Zap, 
  Clock, 
  ChevronRight,
  Plus,
  Sparkles,
  X,
  PenTool
} from 'lucide-react';
import { formatNumber } from '../lib/utils';
import { Link } from 'react-router-dom';

interface DashboardProps {
  user: any;
  profile: any;
}

export default function Dashboard({ user, profile }: DashboardProps) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    async function loadHistory() {
      try {
        const data = await getContentHistory(user.uid);
        setHistory(data);
      } catch (err) {
        console.error("Dashboard history load failed:", err);
        setHistory([]);
      } finally {
        setLoading(false);
      }
    }
    loadHistory();
  }, [user]);

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-12">
      {/* Header Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-8 rounded-[2.5rem] glass-card glass-card-hover group">
           <div className="flex items-center justify-between mb-4">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Available Fuel</p>
             <Zap className="w-5 h-5 text-blue-500 fill-blue-500/20 group-hover:scale-125 transition-transform" />
           </div>
           <h3 className="text-4xl font-black tracking-tighter">
             {formatNumber((profile?.freeCredits || 0) + (profile?.paidCredits || 0))}
           </h3>
           <p className="text-[9px] text-slate-600 font-bold mt-2 uppercase tracking-widest">Priority Credits</p>
        </div>

        <div className="p-8 rounded-[2.5rem] glass-card glass-card-hover group">
           <div className="flex items-center justify-between mb-4">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Total Outputs</p>
             <Sparkles className="w-5 h-5 text-purple-500 group-hover:rotate-12 transition-transform" />
           </div>
           <h3 className="text-4xl font-black tracking-tighter">{history.length}</h3>
           <p className="text-[9px] text-slate-600 font-bold mt-2 uppercase tracking-widest">Generations Made</p>
        </div>

        <div className="md:col-span-2 p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-600 to-indigo-700 border border-white/20 text-white flex justify-between items-center overflow-hidden relative shadow-2xl shadow-blue-600/20 group">
           <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">
                {profile?.plan === 'free' ? "50 Daily Credits" : "Enterprise Access"}
              </p>
              <h3 className="text-3xl font-black mb-6 tracking-tight">Expand your <br /> capabilities</h3>
              <Link to="/profile" className="px-6 py-3 bg-white text-blue-700 hover:bg-slate-100 rounded-2xl text-xs font-black uppercase tracking-widest transition-all inline-block active:scale-95 shadow-xl">
                Upgrade Engine
              </Link>
           </div>
           <Zap className="w-48 h-48 absolute -right-8 -bottom-8 opacity-20 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
           <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-3xl rounded-full -mr-16 -mt-16" />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <section className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between mb-8">
              <div className="space-y-1">
                <h2 className="text-2xl font-black tracking-tight flex items-center gap-3">
                   <History className="w-5 h-5 text-blue-500" />
                  Content Vault
                </h2>
                <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest pl-8">Your generation archive</p>
              </div>
              <div className="flex items-center gap-4">
                <Link 
                  to="/generate" 
                  title="Create new AI content"
                  className="group relative flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 text-white rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.5)] hover:-translate-y-1 active:scale-95 overflow-hidden border border-white/20"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  <span className="text-sm">Launch AI Studio</span>
                </Link>
              </div>
          </div>

          {loading ? (
              <div className="space-y-6">
                {[1,2,3].map(i => (
                  <div key={i} className="h-44 bg-white/5 border border-white/5 animate-pulse rounded-[2.5rem]" />
                ))}
              </div>
          ) : history.length === 0 ? (
            <div className="p-20 text-center rounded-[3rem] glass-card border-dashed border-slate-800 relative overflow-hidden group">
               <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="w-24 h-24 bg-slate-900 rounded-[2rem] flex items-center justify-center mx-auto mb-10 shadow-inner group-hover:scale-110 transition-transform">
                 <History className="w-10 h-10 text-slate-700 group-hover:text-blue-500 transition-colors" />
               </div>
               <h4 className="text-xl font-bold mb-3 text-slate-300 tracking-tight">Your vault is empty</h4>
               <p className="text-sm text-slate-500 mb-10 max-w-xs mx-auto">Start by creating your first generation in the AI Studio.</p>
               <Link to="/generate" className="relative inline-flex items-center gap-4 px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-[2rem] font-black text-sm uppercase tracking-[0.2em] transition-all shadow-[0_20px_50px_rgba(37,99,235,0.4)] hover:shadow-[0_25px_60px_rgba(37,99,235,0.5)] active:scale-95 group/btn border border-white/20">
                 <Sparkles className="w-5 h-5 group-hover/btn:rotate-12 transition-transform" />
                 Launch AI Studio
               </Link>
            </div>
          ) : (
            <div className="space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar pr-4">
              {history.map((item, i) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => {
                    setSelectedItem(item);
                    setIsModalOpen(true);
                  }}
                  className="group relative p-8 rounded-[2.5rem] glass-card glass-card-hover cursor-pointer active:scale-[0.98] transition-all border border-white/5 hover:border-blue-500/30"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-blue-400">
                        {item.type}
                      </div>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                        <Clock className="w-3 h-3" />
                        {item.createdAt?.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(item.output, item.id);
                        }}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-500 hover:text-blue-400 transition-all active:scale-90"
                        title="Copy"
                      >
                        {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Placeholder for edit
                        }}
                        className="p-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-slate-500 hover:text-indigo-400 transition-all active:scale-90"
                        title="Edit"
                      >
                        <PenTool className="w-4 h-4" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Placeholder for delete
                        }}
                        className="p-3 bg-white/5 hover:bg-red-500/10 border border-white/5 rounded-2xl text-slate-500 hover:text-red-400 transition-all active:scale-90"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <h4 className="text-xl font-bold mb-3 tracking-tight group-hover:text-blue-400 transition-colors uppercase">{item.input?.topic || "Untitled"}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed font-medium">
                    {item.output || "No content generated."}
                  </p>
                  <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                     <div className="flex gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase text-slate-600 tracking-tighter">PREMIUM</span>
                        <span className="px-2 py-0.5 rounded-md bg-white/5 text-[8px] font-black uppercase text-slate-600 tracking-tighter">NEURAL</span>
                     </div>
                     <button className="text-[10px] font-black uppercase tracking-widest text-blue-500 hover:text-blue-400 flex items-center gap-2 opacity-100 group-hover:translate-x-1 transition-all">
                        View Full Output <ChevronRight className="w-3 h-3" />
                     </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </section>

        {/* Sidebar */}
        <aside className="space-y-8">
           <div className="p-8 rounded-[2.5rem] glass-card relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full -mr-16 -mt-16 pointer-events-none" />
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-8 flex items-center gap-3">
                <Sparkles className="w-4 h-4 text-blue-500" />
                Growth Tactics
              </h3>
              <ul className="space-y-6">
                 {[
                   "Anchor your hooks with emotional triggers.",
                   "Deploy the 'Persuasive' module for conversions.",
                   "Extended prompts unlock deeper neural paths."
                 ].map((tip, i) => (
                   <li key={i} className="flex gap-5 text-[11px] font-bold text-slate-500 leading-relaxed group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-slate-900 border border-white/5 flex items-center justify-center text-[10px] font-black text-slate-400 group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all">
                        0{i + 1}
                      </div>
                      <span className="pt-1.5">{tip}</span>
                   </li>
                 ))}
              </ul>
              
              <div className="mt-12 p-6 rounded-3xl bg-blue-600/5 border border-blue-500/10 relative group cursor-pointer overflow-hidden">
                 <div className="relative z-10">
                    <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Coming Soon</p>
                    <p className="text-xs font-black text-white uppercase tracking-tight">AI Voice Synthesis</p>
                 </div>
                 <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-white/5 to-blue-600/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
           </div>
        </aside>
      </div>

      {/* Floating Action Button */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-8 right-8 z-[60]"
      >
        <Link 
          to="/generate"
          title="Quick Generate"
          className="flex h-16 w-16 items-center justify-center rounded-[2rem] bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-[0_20px_50px_rgba(37,99,235,0.4)] border border-white/20 active:scale-95 transition-all group overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          <Plus className="h-8 w-8 group-hover:rotate-90 transition-transform duration-500" />
        </Link>
      </motion.div>

      {/* Content Detail Modal */}
      <AnimatePresence>
        {isModalOpen && selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 lg:p-8">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-[#020617]/80 backdrop-blur-xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900/50 border border-white/10 rounded-[3rem] shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />
              
              {/* Header */}
              <div className="flex items-center justify-between p-8 border-b border-white/5 relative z-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-blue-600/10 rounded-2xl">
                    <Sparkles className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white uppercase">{selectedItem.input?.topic || "Untitled"}</h3>
                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Generated Output • {selectedItem.type || "AI"}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 transition-all active:scale-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto custom-scrollbar p-8 relative z-10">
                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 text-slate-300 leading-relaxed font-medium whitespace-pre-wrap">
                  {selectedItem.output || "Content unavailable."}
                </div>
              </div>

              {/* Footer */}
              <div className="p-8 border-t border-white/5 bg-slate-900/30 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                  <Clock className="w-4 h-4" />
                  {selectedItem.createdAt?.toDate().toLocaleDateString('en-US', { 
                    month: 'long', 
                    day: 'numeric', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
                <div className="flex gap-4">
                  <button
                    onClick={() => copyToClipboard(selectedItem.output, selectedItem.id)}
                    className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95"
                  >
                    {copiedId === selectedItem.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedId === selectedItem.id ? 'Copied to Clipboard' : 'Copy Content'}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
