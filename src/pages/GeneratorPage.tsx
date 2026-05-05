import React, { useState, useEffect } from 'react';
import { generateContent, summarizeContent } from '../services/geminiService';
import { saveGeneratedContent, getContentHistory } from '../services/firebaseService';
import { motion, AnimatePresence } from 'motion/react';
import { jsPDF } from 'jspdf';
import { 
  Sparkles, 
  Send, 
  Loader2, 
  Copy, 
  Check, 
  AlertCircle,
  PenTool,
  Type,
  Hash,
  Smile,
  Layout,
  Briefcase,
  Coffee,
  Heart,
  Bell,
  BookOpen,
  History,
  ChevronRight,
  X,
  Zap,
  Pin,
  Linkedin,
  Instagram,
  FileUser,
  Download,
  RefreshCcw,
  MousePointer2
} from 'lucide-react';
import { cn } from '../lib/utils';

// Standard icons for new templates
const LinkedInIcon = Linkedin;
const InstagramIcon = Instagram;
const ResumeIcon = FileUser;

interface GeneratorPageProps {
  user: any;
  profile: any;
  onContentGenerated: () => void;
}

const CONTENT_TYPES = [
  { id: 'blog', label: 'SEO Blog Post', icon: Layout, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { id: 'linkedin', label: 'LinkedIn Post', icon: LinkedInIcon, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { id: 'instagram', label: 'Instagram Caption', icon: InstagramIcon, color: 'text-pink-400', bg: 'bg-pink-500/10' },
  { id: 'resume', label: 'Resume Summary', icon: ResumeIcon, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { id: 'ad', label: 'Ad Copy (FB/Google)', icon: Hash, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { id: 'product', label: 'Product Description', icon: PenTool, color: 'text-orange-400', bg: 'bg-orange-500/10' },
  { id: 'email', label: 'Email Sequence', icon: Type, color: 'text-indigo-400', bg: 'bg-indigo-500/10' },
  { id: 'youtube', label: 'YouTube Script', icon: Bell, color: 'text-red-400', bg: 'bg-red-500/10' },
  { id: 'twitter', label: 'Twitter/X Thread', icon: Hash, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { id: 'coldemail', label: 'Cold Email', icon: Send, color: 'text-violet-400', bg: 'bg-violet-500/10' },
];

const TONALITIES = [
  { id: 'Professional', icon: Briefcase, color: 'text-blue-400' },
  { id: 'Casual', icon: Coffee, color: 'text-orange-400' },
  { id: 'Persuasive', icon: Sparkles, color: 'text-purple-400' },
  { id: 'Friendly', icon: Heart, color: 'text-pink-400' },
  { id: 'Urgent', icon: Bell, color: 'text-red-400' },
  { id: 'Educational', icon: BookOpen, color: 'text-emerald-400' },
];

const LOADING_STEPS = [
  "Analyzing context...",
  "Applying tone of voice...",
  "Structuring paragraphs...",
  "Optimizing for engagement...",
  "Finalizing creative copy..."
];

export default function GeneratorPage({ user, profile, onContentGenerated }: GeneratorPageProps) {
  const [type, setType] = useState('blog');
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [cta, setCta] = useState('');
  const [keywords, setKeywords] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [output, setOutput] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [summaryCopied, setSummaryCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [showInsights, setShowInsights] = useState(true);
  const [isOutputActive, setIsOutputActive] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [displayedOutput, setDisplayedOutput] = useState('');

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_STEPS.length);
      }, 2000);
    } else {
      setLoadingStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    fetchHistory();
  }, [user.uid]);

  useEffect(() => {
    if (output) {
      let i = 0;
      setDisplayedOutput('');
      const speed = output.length > 500 ? 5 : 15;
      const interval = setInterval(() => {
        setDisplayedOutput(output.slice(0, i));
        i += 5;
        if (i > output.length) {
          setDisplayedOutput(output);
          clearInterval(interval);
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [output]);

  const fetchHistory = async () => {
    try {
      const data = await getContentHistory(user.uid);
      setHistory(data.slice(0, 5));
    } catch (err) {
      console.error("Failed to fetch history:", err);
    }
  };

  const handleGenerate = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const totalCredits = (profile?.freeCredits || 0) + (profile?.paidCredits || 0);
    
    if (!topic.trim()) {
      setError("Please enter a topic or keywords to generate content.");
      return;
    }

    if (!profile || totalCredits < 5) {
      setError("Insufficient credits. Your daily free limit may have been reached. Upgrade to continue.");
      return;
    }

    setLoading(true);
    setError(null);
    setOutput(null);
    setDisplayedOutput('');
    setSummary(null);
    setIsOutputActive(false);
    setShowSuccess(false);

    try {
      const result = await generateContent(type as any, topic, keywords, tone, { audience, cta });
      if (result) {
        setOutput(result);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 4000);

        setTimeout(() => {
          const element = document.getElementById("generated-output");
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => setIsOutputActive(true), 100);
            setTimeout(() => setIsOutputActive(false), 3000);
          }
        }, 500);
        
        setSummaryLoading(true);
        try {
          const summaryResult = await summarizeContent(result);
          setSummary(summaryResult);
        } catch (sumErr) {
          console.error("Summary generation failed:", sumErr);
        } finally {
          setSummaryLoading(false);
        }

        try {
          await saveGeneratedContent(user.uid, type, { topic, keywords, tone, audience, cta }, result);
          onContentGenerated();
          fetchHistory();
        } catch (saveErr) {
          console.error("Failed to save content history:", saveErr);
        }
      }
    } catch (err: any) {
      setError(err.message || "An error occurred while generating content.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (output) {
      navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const getStats = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const chars = text.length;
    const readTime = Math.max(1, Math.ceil(words / 200));
    return { words, chars, readTime };
  };

  // Simple inline markdown renderer
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Headings
      if (line.startsWith('### ')) return <h3 key={i} className="text-lg font-black text-white mt-6 mb-2">{line.slice(4)}</h3>;
      if (line.startsWith('## ')) return <h2 key={i} className="text-xl font-black text-white mt-8 mb-3 border-b border-white/10 pb-2">{line.slice(3)}</h2>;
      if (line.startsWith('# ')) return <h1 key={i} className="text-2xl font-black text-white mt-8 mb-4">{line.slice(2)}</h1>;
      // Bullet points
      if (line.startsWith('- ') || line.startsWith('* ')) {
        const content = line.slice(2);
        return <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed my-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-2 shrink-0" />
          <span>{renderInline(content)}</span>
        </li>;
      }
      // Numbered list
      if (/^\d+\.\s/.test(line)) {
        const num = line.match(/^(\d+)\./)?.[1];
        const content = line.replace(/^\d+\.\s/, '');
        return <li key={i} className="flex gap-3 text-slate-300 text-sm leading-relaxed my-1.5">
          <span className="text-indigo-400 font-black text-xs mt-0.5 shrink-0 w-4">{num}.</span>
          <span>{renderInline(content)}</span>
        </li>;
      }
      // Empty line
      if (line.trim() === '') return <div key={i} className="h-3" />;
      // Normal paragraph
      return <p key={i} className="text-slate-200 text-base leading-[1.85] font-medium my-1">{renderInline(line)}</p>;
    });
  };

  const renderInline = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) return <strong key={i} className="font-black text-white">{part.slice(2,-2)}</strong>;
      if (part.startsWith('*') && part.endsWith('*')) return <em key={i} className="italic text-slate-300">{part.slice(1,-1)}</em>;
      if (part.startsWith('`') && part.endsWith('`')) return <code key={i} className="px-1.5 py-0.5 rounded-md bg-white/10 text-indigo-300 text-xs font-mono">{part.slice(1,-1)}</code>;
      return part;
    });
  };

  const downloadAsPDF = () => {
    if (!output) return;
    const doc = new jsPDF();
    doc.setFontSize(22);
    doc.setTextColor(37, 99, 235);
    doc.text('ContextAI Output', 20, 30);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Type: ${type.toUpperCase()}`, 20, 40);
    doc.text(`Topic: ${topic}`, 20, 45);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 50);
    doc.setDrawColor(220);
    doc.line(20, 55, 190, 55);
    doc.setFontSize(12);
    doc.setTextColor(50);
    const splitText = doc.splitTextToSize(output, 170);
    doc.text(splitText, 20, 70);
    const safeTopic = (topic || "content").replace(/\s+/g, '-').toLowerCase();
    doc.save(`ContextAI-${safeTopic}.pdf`);
  };

  return (
    <>
      <div className="h-full flex flex-col gap-12 max-w-5xl mx-auto py-8 relative">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: 40, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
              className="fixed top-0 left-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-950 border border-red-500/50 text-white shadow-[0_20px_50px_rgba(239,68,68,0.2)] backdrop-blur-2xl min-w-[380px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-red-500/20 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-red-500 mb-0.5 uppercase tracking-[0.2em]">Attention Required</p>
                <p className="text-sm text-slate-200 font-semibold">{error}</p>
              </div>
              <button onClick={() => setError(null)} className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-500">
                <X className="w-4 h-4" />
              </button>
            </motion.div>
          )}

          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
              animate={{ opacity: 1, scale: 1, y: 40, x: '-50%' }}
              exit={{ opacity: 0, scale: 0.9, y: 20, x: '-50%' }}
              className="fixed top-0 left-1/2 z-[100] flex items-center gap-4 px-6 py-4 rounded-3xl bg-slate-950 border border-emerald-500/30 text-white shadow-[0_20px_50px_rgba(16,185,129,0.2)] backdrop-blur-2xl min-w-[320px]"
            >
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                <Check className="w-5 h-5 text-emerald-500" />
              </div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-emerald-500 mb-0.5 uppercase tracking-[0.2em]">Success</p>
                <p className="text-sm text-slate-200 font-semibold">Your content is ready!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 gap-12">
          <section className="w-full">
            <div className="glass-card rounded-[3rem] p-10 space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 rounded-3xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
                    <PenTool className="w-7 h-7 text-blue-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-black tracking-tight mb-1 uppercase">AI Studio</h2>
                    <p className="text-slate-500 text-sm font-medium">Input your vision, our AI handles the rest.</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="px-5 py-2.5 rounded-2xl bg-white/[0.03] border border-white/5 flex flex-col items-end">
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Available Credits</span>
                    <span className="text-lg font-black text-white">{(profile?.freeCredits || 0) + (profile?.paidCredits || 0)}</span>
                  </div>
                </div>
              </div>

              <form onSubmit={handleGenerate} className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                       <Layout className="w-3.5 h-3.5" />
                       Content Blueprint
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {CONTENT_TYPES.map((ct) => (
                        <button
                          key={ct.id}
                          type="button"
                          disabled={loading}
                          onClick={() => setType(ct.id)}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-2xl border text-[11px] font-black transition-all group relative overflow-hidden",
                            type === ct.id ? "bg-blue-600 border-white/20 text-white shadow-xl shadow-blue-600/20" : "bg-white/[0.03] border-white/5 text-slate-500 hover:bg-white/[0.08]"
                          )}
                        >
                          <ct.icon className={cn("w-4 h-4", type === ct.id ? "text-white" : ct.color)} />
                          <span className="tracking-widest uppercase">{ct.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 flex items-center gap-2">
                      <Type className="w-3.5 h-3.5" />
                      Core Topic
                    </label>
                    <input
                      required
                      disabled={loading}
                      type="text"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                      placeholder="e.g. The Future of Space Travel"
                      className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-5 text-sm font-medium focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder:text-slate-700 shadow-inner"
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Emotional Tone</label>
                    <div className="flex flex-wrap gap-2">
                      {TONALITIES.map((t) => (
                        <button
                          key={t.id}
                          type="button"
                          disabled={loading}
                          onClick={() => setTone(t.id)}
                          className={cn(
                            "px-6 py-3 rounded-xl border text-[10px] font-black transition-all uppercase tracking-widest",
                            tone === t.id ? "bg-white border-white text-slate-950" : "bg-white/[0.03] border-white/5 text-slate-500 hover:bg-white/10"
                          )}
                        >
                          <t.icon className={cn("w-3.5 h-3.5 mr-2", tone === t.id ? "text-blue-600" : t.color)} />
                          {t.id}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 pt-6 border-t border-white/5">
                  <button
                    disabled={loading || ((profile?.freeCredits || 0) + (profile?.paidCredits || 0) < 5)}
                    className={cn(
                      "group relative w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-4 overflow-hidden",
                      loading ? "bg-slate-900 text-slate-500" : "bg-gradient-to-r from-[#4F46E5] to-[#9333EA] text-white shadow-[0_20px_50px_rgba(79,70,229,0.4)] hover:-translate-y-1 active:scale-[0.98] hover:shadow-[0_25px_60px_rgba(147,51,234,0.6)]"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span className="tracking-widest capitalize">Synthesizing Neural Output...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        <span className="tracking-widest capitalize">Initialize Generation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </section>

          <section className="w-full space-y-12 pb-24">
            <div className="max-w-4xl mx-auto w-full">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                  <Layout className="w-4 h-4" />
                  Generated Output
                </h3>
                <div className="flex items-center gap-3">
                  {output && (
                    <>
                      <button onClick={handleRegenerate} disabled={loading} className="flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 disabled:opacity-40">
                        <RefreshCcw className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Regenerate</span>
                      </button>
                      <button onClick={() => setShowInsights(!showInsights)} className={cn("flex items-center gap-2 px-4 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border", showInsights ? "bg-blue-600/10 text-blue-400 border-blue-500/20" : "bg-white/5 text-slate-500 border-white/10")}>
                        <Zap className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">{showInsights ? "Hide" : "Insights"}</span>
                      </button>
                      <button onClick={downloadAsPDF} className="p-3 bg-white/5 border border-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"><Download className="w-4 h-4" /></button>
                      <button onClick={copyToClipboard} className="flex items-center gap-2 px-6 py-3 bg-white text-slate-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-all">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? "Copied" : "Copy"}
                      </button>
                    </>
                  )}
                </div>
              </div>

              <div id="generated-output" className={cn("glass-card rounded-[3rem] p-12 lg:p-16 min-h-[400px] flex flex-col border transition-all duration-700 relative overflow-hidden", isOutputActive ? "active" : "border-white/5")}>
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div key="loading-output" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex-1 flex flex-col items-center justify-center py-20">
                      <div className="relative mb-12">
                        <motion.div 
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }} 
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                          className="w-24 h-24 bg-gradient-to-tr from-[#4F46E5] to-[#9333EA] rounded-[2rem] flex items-center justify-center shadow-[0_0_80px_rgba(147,51,234,0.4)] relative z-10"
                        >
                          <Sparkles className="w-10 h-10 text-white" />
                        </motion.div>
                        <div className="absolute inset-0 bg-[#9333EA]/40 blur-[60px] -z-10 animate-pulse-glow" />
                        
                        {/* Orbiting particles */}
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} className="absolute -inset-8 border border-white/10 rounded-full border-dashed" />
                        <motion.div animate={{ rotate: -360 }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }} className="absolute -inset-16 border border-white/5 rounded-full border-dotted" />
                      </div>
                      <h4 className="text-2xl font-black tracking-tight bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent mb-3">
                        {LOADING_STEPS[loadingStep]}
                      </h4>
                      <p className="text-slate-500 text-sm font-medium tracking-wide">Synthesizing parameters • Aligning tone • Constructing narrative</p>
                    </motion.div>
                  ) : output ? (
                    <motion.div key="output-content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex-1">
                      {/* Stats Bar */}
                      {displayedOutput === output && (() => {
                        const stats = getStats(output);
                        return (
                          <div className="flex items-center gap-6 mb-8 pb-6 border-b border-white/5 flex-wrap">
                            <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
                              {stats.words} words
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Zap className="w-3.5 h-3.5 text-emerald-400" />
                              ~{stats.readTime} min read
                            </span>
                            <span className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                              <Type className="w-3.5 h-3.5 text-blue-400" />
                              {stats.chars.toLocaleString()} chars
                            </span>
                          </div>
                        );
                      })()}
                      {/* Rendered Markdown output */}
                      <div className="prose-custom">
                        {renderMarkdown(displayedOutput)}
                        {displayedOutput !== output && (
                          <motion.span animate={{ opacity: [1, 0] }} transition={{ duration: 0.5, repeat: Infinity }} className="inline-block w-1.5 h-5 bg-indigo-400 ml-1 translate-y-1 rounded-sm" />
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center opacity-20 py-20 grayscale">
                      <Sparkles className="w-12 h-12 mb-6 text-slate-500" />
                      <h4 className="text-xl font-bold text-slate-400 mb-1">Your Creative Canvas</h4>
                      <p className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-600">Select a blueprint to begin</p>
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <AnimatePresence>
              {showInsights && summary && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }} className="max-w-4xl mx-auto w-full">
                  <div className="flex items-center gap-3 mb-8">
                    <h3 className="text-sm font-black uppercase tracking-[0.3em] text-slate-500 flex items-center gap-3">
                      <Zap className="w-4 h-4 text-yellow-500" />
                      Key Insights
                    </h3>
                  </div>
                  <div className="glass-card rounded-[3rem] p-12 border border-white/5 bg-white/[0.01]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                      <div className="space-y-6">
                        {summary.split('\n').filter(line => line.trim().length > 0).map((line, idx) => (
                          <div key={idx} className="flex gap-4 group">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-2 shrink-0 group-hover:scale-150 transition-transform shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">{line.replace(/^[\s•*-]+/, '')}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex flex-col justify-center gap-8 pl-12 border-l border-white/5">
                        <div className="space-y-4">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-slate-600">Strategic Resonance</h5>
                          <div className="flex flex-wrap gap-2">
                             {['Highly Authoritative', 'Viral Potential', 'SEO Ready'].map(tag => (
                               <span key={tag} className="px-4 py-2 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] font-bold text-blue-400/70">{tag}</span>
                             ))}
                          </div>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">Refinement Node</p>
                          <p className="text-xs text-slate-400 leading-relaxed italic">"This output has been optimized for structural clarity and emotional engagement based on your selected context."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 z-[50] lg:block hidden">
        <div className="glass-card px-6 py-3 rounded-2xl border border-white/5 flex items-center gap-8 backdrop-blur-3xl shadow-2xl">
          <div className="flex items-center gap-2 px-3 border-r border-white/10 shrink-0">
             <History className="w-4 h-4 text-slate-500" />
             <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vault</span>
          </div>
          <div className="flex items-center gap-4 py-1">
             {history.slice(0, 5).map((item) => <div key={item.id} className="w-2 h-2 rounded-full bg-blue-500/20" />)}
          </div>
        </div>
      </div>
    </>
  );
}
