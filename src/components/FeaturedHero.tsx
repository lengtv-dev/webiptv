import React from 'react';
import { Play, ExternalLink, ShieldCheck, Wifi, Radio } from 'lucide-react';
import { XtreamCredentials } from '../types';

interface FeaturedHeroProps {
  creds?: XtreamCredentials | null;
  authData?: any;
  onWatchNow: () => void;
  onOpenSports: () => void;
  onOpenVlc?: () => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  creds,
  authData,
  onWatchNow,
  onOpenSports,
  onOpenVlc,
}) => {
  const username = creds?.username || 'playidtv2535';
  const serverHost = creds?.server_url?.replace(/^https?:\/\//, '') || '103.114.203.129:8080';

  return (
    <section
      id="artistic-featured-hero"
      className="relative w-full min-h-[300px] sm:min-h-[320px] rounded-[32px] sm:rounded-[40px] overflow-hidden mb-8 border border-[#333] group shadow-2xl bg-[#0a0a0a]"
    >
      {/* Dynamic Dramatic Dark Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30 z-10" />

      {/* Hero Background Image (Liverpool vs Arsenal Anfield Premier League) */}
      <div
        className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=1200&auto=format&fit=crop")',
        }}
      />

      {/* Main Content Layout */}
      <div className="relative z-20 h-full flex flex-col lg:flex-row lg:items-center justify-between p-6 sm:p-10 lg:p-12 gap-6">
        {/* Left Hero Content */}
        <div className="flex flex-col justify-center gap-3 sm:gap-4 max-w-xl">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-red-600/30">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </span>
            <span className="text-white/70 text-xs font-bold uppercase tracking-widest">
              Premier League • Matchday 24
            </span>
            <span className="bg-[#FF6321] text-black text-[9px] font-black px-2 py-0.5 rounded italic">
              4K UHD
            </span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black italic uppercase leading-[0.92] tracking-tighter text-white drop-shadow-md">
            Liverpool <span className="text-[#FF6321]">vs</span> Arsenal
          </h2>

          <p className="text-[#aaa] text-xs sm:text-sm max-w-md leading-relaxed">
            Anfield Stadium, Liverpool. ถ่ายทอดสดระบบ 4K Ultra HD คมชัดระดับสูงสุด สตรีมผ่าน Smart Proxy ปราศจากการกระตุก
          </p>

          <div className="flex items-center gap-3 sm:gap-4 mt-2 flex-wrap">
            <button
              id="hero-watch-now-btn"
              onClick={onWatchNow}
              className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-black text-xs sm:text-sm tracking-wide hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.25)] active:scale-95"
            >
              <Play className="w-4 h-4 fill-black" />
              WATCH NOW
            </button>

            <button
              id="hero-open-sports-btn"
              onClick={onOpenSports}
              className="flex items-center gap-2 backdrop-blur-md bg-white/10 hover:bg-white/20 border border-white/20 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold text-xs sm:text-sm transition-all hover:scale-105 active:scale-95"
            >
              <Radio className="w-4 h-4 text-[#FF6321]" />
              ตารางถ่ายทอดสด
            </button>
          </div>
        </div>

        {/* Right Glass Quick Info Panel */}
        <div className="backdrop-blur-xl bg-black/60 border border-white/15 p-5 sm:p-6 rounded-3xl w-full lg:w-[320px] shadow-2xl space-y-3.5">
          <div className="flex justify-between items-center pb-2.5 border-b border-white/10">
            <span className="text-[10px] font-black tracking-widest text-[#888] uppercase">
              Server Status
            </span>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_8px_#00FF00] animate-pulse" />
              <span className="text-[10px] text-[#00FF00] font-mono font-bold tracking-tight">
                {serverHost}
              </span>
            </div>
          </div>

          <div className="space-y-2.5">
            <div className="flex justify-between text-xs items-center">
              <span className="text-[#888]">Active Account</span>
              <span className="font-mono font-bold text-[#FF6321] bg-[#FF6321]/10 px-2 py-0.5 rounded border border-[#FF6321]/20">
                {username}
              </span>
            </div>

            <div className="flex justify-between text-xs items-center">
              <span className="text-[#888]">Stream Proxy</span>
              <span className="text-white font-semibold flex items-center gap-1 text-[11px]">
                <Wifi className="w-3 h-3 text-[#00FF00]" />
                ACTIVE (CORS/SSL OK)
              </span>
            </div>

            <div className="flex justify-between text-xs items-center">
              <span className="text-[#888]">Content Filter</span>
              <span className="text-white font-semibold flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3 h-3 text-[#D4145A]" />
                PIN Protected
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
