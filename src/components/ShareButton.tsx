import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Copy, Check, X, Users } from 'lucide-react';
import { getOrCreateReferralLink, getReferralCount, getShareMessages } from '../services/referralService';
import { analytics } from '../hooks/useAnalytics';

interface ShareButtonProps {
  userId: string;
  compact?: boolean;
}

export default function ShareButton({ userId, compact = false }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [refLink, setRefLink] = useState('');
  const [copied, setCopied] = useState(false);
  const [referralCount, setReferralCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      setLoading(true);
      const [link, count] = await Promise.all([
        getOrCreateReferralLink(userId),
        getReferralCount(userId),
      ]);
      setRefLink(link);
      setReferralCount(count);
      setLoading(false);
    })();
  }, [userId]);

  const messages = refLink ? getShareMessages(refLink) : null;

  const handleCopy = async () => {
    if (!refLink) return;
    await navigator.clipboard.writeText(refLink);
    setCopied(true);
    analytics.referralLinkCopied();
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShare = (platform: 'whatsapp' | 'twitter' | 'linkedin') => {
    if (!messages) return;
    analytics.shareClicked(platform);
    window.open(messages[platform], '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={`flex items-center gap-2 font-black uppercase tracking-widest transition-all ${
          compact
            ? 'px-4 py-2 text-[9px] rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500/20'
            : 'px-6 py-3 text-[10px] rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-300 hover:border-indigo-500/50'
        }`}
      >
        <Share2 className="w-3.5 h-3.5" />
        Share ContextAI
        {referralCount > 0 && (
          <span className="ml-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[8px]">
            {referralCount} joined
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
              onClick={() => setOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-full max-w-md px-4"
            >
              <div className="relative bg-[#080f1e] rounded-[2.5rem] border border-white/10 p-8 shadow-2xl overflow-hidden">
                {/* Glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-indigo-600/20 blur-[60px] rounded-full" />

                <button onClick={() => setOpen(false)} className="absolute top-5 right-5 p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-500">
                  <X className="w-4 h-4" />
                </button>

                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center mb-5">
                    <Share2 className="w-5 h-5 text-indigo-400" />
                  </div>

                  <h3 className="text-xl font-black text-white mb-1">Share ContextAI</h3>
                  <p className="text-slate-500 text-sm font-medium mb-6">
                    Share your personal link and track who joins through you!
                  </p>

                  {/* Referral count */}
                  {!loading && (
                    <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                      <Users className="w-4 h-4 text-emerald-400 shrink-0" />
                      <div>
                        <p className="text-emerald-400 font-black text-sm">
                          {referralCount === 0
                            ? 'No one has joined via your link yet'
                            : `${referralCount} user${referralCount > 1 ? 's' : ''} joined via your link!`}
                        </p>
                        <p className="text-[10px] text-slate-600 font-medium">Share below to grow your count</p>
                      </div>
                    </div>
                  )}

                  {/* Share buttons */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    {/* WhatsApp */}
                    <button onClick={() => handleShare('whatsapp')}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#25D366]/10 border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all group">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#25D366">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#25D366]">WhatsApp</span>
                    </button>

                    {/* Twitter/X */}
                    <button onClick={() => handleShare('twitter')}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="white">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-widest text-slate-300">Twitter/X</span>
                    </button>

                    {/* LinkedIn */}
                    <button onClick={() => handleShare('linkedin')}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 hover:bg-[#0A66C2]/20 transition-all group">
                      <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0A66C2">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                      <span className="text-[9px] font-black uppercase tracking-widest text-[#0A66C2]">LinkedIn</span>
                    </button>
                  </div>

                  {/* Copy link */}
                  <div className="flex items-center gap-2 p-3 rounded-2xl bg-white/[0.03] border border-white/10">
                    <p className="flex-1 text-xs text-slate-400 font-mono truncate">{refLink || 'Loading...'}</p>
                    <button onClick={handleCopy}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shrink-0">
                      {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
