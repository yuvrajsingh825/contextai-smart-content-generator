import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Zap, CreditCard, Shield, Star, Check, Loader2 } from 'lucide-react';
import { cn, formatNumber } from '../lib/utils';
import ShareButton from '../components/ShareButton';

interface ProfilePageProps {
  user: any;
  profile: any;
}

const PLANS = [
  { id: 'starter', name: "Starter", price: 99, credits: 50, color: "border-zinc-800" },
  { id: 'pro', name: "Professional", price: 199, credits: 120, color: "border-orange-500/50 hover:border-orange-500", popular: true },
  { id: 'elite', name: "Elite", price: 499, credits: 350, color: "border-zinc-800" },
];

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ProfilePage({ user, profile }: ProfilePageProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePayment = async (plan: typeof PLANS[0]) => {
    setLoading(plan.id);
    try {
      const resp = await fetch("/api/payment/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: plan.price, 
          planId: plan.id,
          userId: user.uid,
          credits: plan.credits
        })
      });
      const order = await resp.json();

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || "rzp_test_xxxx", // Use environment variable
        amount: order.amount,
        currency: "INR",
        name: "ContextAI",
        description: `Buying ${plan.credits} credits`,
        order_id: order.id,
        handler: function (response: any) {
          alert(`Payment Successful! Signature: ${response.razorpay_signature}`);
          // In a real app, the webhook handles credit update, 
          // but we might want to refresh profile here too.
        },
        prefill: {
          name: user.displayName || "",
          email: user.email || "",
        },
        theme: { color: "#f97316" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      alert("Razorpay key not configured. This is a demo integration.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-16 py-8">
      {/* Profile Header */}
      <section className="flex flex-col md:flex-row items-center gap-8 p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-xl relative overflow-hidden shadow-2xl">
         <img 
           src={user.photoURL || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.uid}`} 
           className="w-24 h-24 rounded-3xl border border-white/10 shadow-2xl z-10 object-cover" 
           alt="Profile"
           referrerPolicy="no-referrer"
         />
         <div className="text-center md:text-left flex-1 z-10">
            <h2 className="text-3xl font-bold mb-1">{user.displayName || "ContextAI User"}</h2>
            <p className="text-slate-500 mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
               <div className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl text-sm font-bold flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-500" />
                  <span className="text-slate-200">{(profile?.freeCredits || 0) + (profile?.paidCredits || 0)} Total Credits</span>
               </div>
               <div className="px-4 py-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-xl text-sm font-bold flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-500" />
                  <span className="text-slate-200">{profile?.plan === 'free' ? 'Free Plan' : 'Pro Plan'}</span>
               </div>
            </div>
         </div>
         <div className="absolute top-1/2 right-4 -translate-y-1/2 opacity-[0.02] pointer-events-none">
            <Shield className="w-48 h-48" />
         </div>
         {/* Decorative blob inside */}
         <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 blur-3xl rounded-full -mr-32 -mt-32 pointer-events-none" />
      </section>

      {/* Share & Referral */}
      <section className="mb-12">
        <div className="p-8 rounded-[2.5rem] bg-gradient-to-br from-indigo-500/10 to-purple-500/5 border border-indigo-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-black text-white mb-1">Share ContextAI with friends</h3>
            <p className="text-slate-500 text-sm font-medium">Get a personal referral link and track how many people join through you!</p>
          </div>
          {user?.uid && <ShareButton userId={user.uid} />}
        </div>
      </section>

      {/* Credit Refills */}
      <section id="refill-section">
         <div className="text-center mb-16">
            {((profile?.freeCredits || 0) + (profile?.paidCredits || 0)) === 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-8 inline-flex items-center gap-2 px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-red-500 text-xs font-black uppercase tracking-widest animate-pulse"
              >
                <Zap className="w-3 h-3 fill-red-500" />
                Daily limit reached. Fuel up to continue.
              </motion.div>
            )}
            <h3 className="text-5xl font-black mb-6 tracking-tighter bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">Premium Content Packages</h3>
            <p className="text-slate-500 font-medium max-w-xl mx-auto leading-relaxed">Choose a precision engine for your content needs. Paid credits never expire and include prioritized AI processing.</p>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end">
            {PLANS.map((plan) => (
              <motion.div 
                key={plan.id}
                whileHover={{ y: -8 }}
                className={cn(
                  "relative p-10 rounded-[3rem] bg-slate-900/40 border-2 transition-all flex flex-col backdrop-blur-3xl overflow-hidden group",
                  plan.id === 'pro' 
                    ? "border-blue-600 scale-105 z-10 shadow-[0_40px_100px_-20px_rgba(37,99,235,0.2)]" 
                    : "border-white/5 hover:border-white/20 shadow-2xl"
                )}
              >
                {plan.id === 'pro' && (
                  <div className="absolute inset-x-0 -top-px h-1 bg-gradient-to-r from-transparent via-blue-400 to-transparent animate-shine" />
                )}
                
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 bg-blue-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-xl shadow-blue-600/40 z-20">
                    Most Popular
                  </div>
                )}

                <div className="mb-10 relative">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-4">{plan.name} Tier</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tighter">₹{plan.price}</span>
                    <span className="text-slate-600 font-bold text-xs uppercase tracking-widest">/ one-time</span>
                  </div>
                </div>

                <div className="space-y-6 mb-12 flex-1">
                   {[
                     `${plan.credits} AI Generations`,
                     "Priority Engine Access",
                     "Premium Templates",
                     "Export as PDF/Doc",
                     "Lifetime Roll-over"
                   ].map((feature, idx) => (
                     <div key={idx} className="flex items-center gap-4 text-xs font-bold text-slate-400">
                        <div className={cn(
                          "w-5 h-5 rounded-lg flex items-center justify-center shrink-0",
                          plan.id === 'pro' ? "bg-blue-600/20 text-blue-400" : "bg-white/5 text-slate-500"
                        )}>
                          <Check className="w-3 h-3" />
                        </div>
                        <span className={cn(idx === 0 && "text-slate-100 font-black tracking-wide")}>{feature}</span>
                     </div>
                   ))}
                </div>

                <button
                  onClick={() => handlePayment(plan)}
                  disabled={loading === plan.id}
                  className={cn(
                    "relative w-full py-5 rounded-2xl font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2 overflow-hidden active:scale-95",
                    plan.id === 'pro' 
                      ? "bg-blue-600 text-white shadow-xl shadow-blue-600/20 hover:bg-blue-500" 
                      : "bg-white/10 text-slate-300 hover:bg-white/20"
                  )}
                >
                  {loading === plan.id ? <Loader2 className="w-5 h-5 animate-spin" /> : <CreditCard className="w-5 h-5" />}
                  {loading === plan.id ? "Processing..." : `Secure Checkout`}
                </button>
                
                {plan.id === 'pro' && (
                  <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full pointer-events-none" />
                )}
              </motion.div>
            ))}
         </div>
      </section>

      {/* Trust Badges */}
      <section className="flex flex-wrap justify-center gap-12 pt-12 border-t border-zinc-900">
         <div className="flex items-center gap-3 text-zinc-500">
            <Shield className="w-8 h-8 opacity-50" />
            <div className="text-left">
               <p className="text-xs font-bold uppercase tracking-tighter">Secure Payment</p>
               <p className="text-[10px opacity-50]">SSL Encrypted Gateway</p>
            </div>
         </div>
         <div className="flex items-center gap-3 text-zinc-500">
            <Star className="w-8 h-8 opacity-50" />
            <div className="text-left">
               <p className="text-xs font-bold uppercase tracking-tighter">High Quality</p>
               <p className="text-[10px opacity-50]">Powered by Gemini 3</p>
            </div>
         </div>
      </section>
    </div>
  );
}

