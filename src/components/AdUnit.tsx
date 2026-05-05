import React, { useEffect } from 'react';

interface AdUnitProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  className?: string;
}

export default function AdUnit({ slot, format = 'auto', className = '' }: AdUnitProps) {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense error:', err);
    }
  }, []);

  return (
    <div className={`overflow-hidden rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center p-4 min-h-[100px] ${className}`}>
      {/* 
        This is the actual Google AdSense unit.
        You must replace data-ad-client with your publisher ID once approved.
      */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // TODO: Replace with your AdSense Publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      
      {/* Fallback/Placeholder while AdSense is empty or blocked */}
      <div className="absolute opacity-30 text-[10px] font-black uppercase tracking-widest text-slate-500 pointer-events-none">
        Advertisement
      </div>
    </div>
  );
}
