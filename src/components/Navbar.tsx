import React from 'react';
import {
  Tv,
  Search,
  Download,
  Calendar,
  Crown,
  Shield,
  ShieldAlert,
  Moon,
  Sun,
  User,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { ActiveTab, XtreamAuthResponse, XtreamCredentials } from '../types';
import { getM3uPlaylistExportUrl } from '../services/api';

interface NavbarProps {
  creds: XtreamCredentials | null;
  authData: XtreamAuthResponse | null;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenSports: () => void;
  onOpenVip: () => void;
  onOpenPinModal: () => void;
  onOpenLogin: () => void;
  onLogout: () => void;
  showAdultContent: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  activeTab?: ActiveTab;
  onSelectTab?: (tab: ActiveTab) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  creds,
  authData,
  searchQuery,
  onSearchChange,
  onOpenSports,
  onOpenVip,
  onOpenPinModal,
  onOpenLogin,
  onLogout,
  showAdultContent,
  theme,
  onToggleTheme,
  activeTab = 'live',
  onSelectTab,
}) => {
  // Format expiry date
  let expDateStr = 'ถาวร (Unlimited)';
  if (authData?.user_info?.exp_date) {
    const ts = parseInt(authData.user_info.exp_date, 10);
    if (!isNaN(ts) && ts > 0) {
      expDateStr = new Date(ts * 1000).toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    }
  }

  const m3uUrl = creds ? getM3uPlaylistExportUrl(creds) : '';

  return (
    <header
      id="app-main-navbar"
      className="sticky top-0 z-40 w-full h-18 bg-[#000]/95 border-b border-[#1a1a1a] backdrop-blur-2xl px-4 sm:px-6 flex items-center justify-between gap-3 text-[#e0e0e0] select-none shadow-xl"
    >
      {/* Brand Logo & Links */}
      <div className="flex items-center gap-4 lg:gap-6 flex-shrink-0">
        {/* Brand Icon */}
        <div className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-gradient-to-br from-[#FF6321] to-[#D4145A] flex items-center justify-center text-white font-black italic text-xl shadow-[0_0_20px_rgba(255,99,33,0.35)]">
          P
        </div>

        {/* Brand Text */}
        <div className="flex items-center gap-4">
          <div className="cursor-pointer" onClick={() => onSelectTab && onSelectTab('live')}>
            <h1 className="text-xl sm:text-2xl font-black tracking-tighter uppercase italic leading-none text-white">
              PlayID <span className="text-[#FF6321]">IPTV</span>
            </h1>
            <p className="text-[10px] text-[#888] font-mono tracking-tight mt-0.5 hidden sm:block">
              {creds?.anyname || 'XTREAM CODES PRO'}
            </p>
          </div>

          <div className="hidden lg:block h-6 w-[1px] bg-[#333]" />

          {/* Quick Header Navigation Links */}
          {onSelectTab && (
            <div className="hidden lg:flex items-center gap-5 text-xs font-semibold uppercase tracking-widest text-[#888]">
              <button
                onClick={() => onSelectTab('live')}
                className={`transition-colors py-1 ${
                  activeTab === 'live'
                    ? 'text-white border-b-2 border-[#FF6321] font-bold'
                    : 'hover:text-white'
                }`}
              >
                Live TV
              </button>
              <button
                onClick={() => onSelectTab('vod')}
                className={`transition-colors py-1 ${
                  activeTab === 'vod'
                    ? 'text-white border-b-2 border-[#FF6321] font-bold'
                    : 'hover:text-white'
                }`}
              >
                Movies
              </button>
              <button
                onClick={() => onSelectTab('series')}
                className={`transition-colors py-1 ${
                  activeTab === 'series'
                    ? 'text-white border-b-2 border-[#FF6321] font-bold'
                    : 'hover:text-white'
                }`}
              >
                Series
              </button>
              <button
                onClick={() => onSelectTab('favorites')}
                className={`transition-colors py-1 ${
                  activeTab === 'favorites'
                    ? 'text-[#D4145A] border-b-2 border-[#D4145A] font-bold'
                    : 'hover:text-white'
                }`}
              >
                Favorites
              </button>
              <button
                onClick={() => onSelectTab('history')}
                className={`transition-colors py-1 ${
                  activeTab === 'history'
                    ? 'text-white border-b-2 border-[#FF6321] font-bold'
                    : 'hover:text-white'
                }`}
              >
                History
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Global Search Input with Pill Design */}
      <div className="flex-1 max-w-xs sm:max-w-sm md:max-w-md mx-2 sm:mx-4">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[#666] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาช่องทีวีสด, หนัง VOD, ซีรีส์..."
            className="w-full pl-10 pr-8 py-2 rounded-full bg-[#111] border border-[#222] focus:border-[#FF6321] text-xs sm:text-sm text-[#e0e0e0] placeholder-[#555] outline-none transition-all focus:ring-1 focus:ring-[#FF6321] shadow-inner"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#777] hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* VIP Access Button with Signature Badge */}
        <button
          id="navbar-vip-btn"
          onClick={onOpenVip}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg bg-[#FF6321] hover:bg-[#ff7536] text-black text-[11px] font-black italic shadow-[0_0_15px_rgba(255,99,33,0.35)] transition-all hover:scale-105 active:scale-95 uppercase tracking-wider"
          title="ดูแพ็กเกจสมาชิก VIP ACCESS"
        >
          <Crown className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>VIP ACCESS</span>
        </button>

        {/* Live Sports Schedule Button */}
        <button
          id="navbar-sports-btn"
          onClick={onOpenSports}
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111] hover:bg-[#1a1a1a] text-[#ddd] text-xs font-semibold border border-[#222] hover:border-[#333] transition-all shadow-sm"
          title="ตารางถ่ายทอดสดฟุตบอลและกีฬา"
        >
          <Calendar className="w-3.5 h-3.5 text-[#FF6321]" />
          <span>ตารางกีฬา</span>
        </button>

        {/* 18+ Adult Content PIN Toggle */}
        <button
          id="navbar-adult-pin-btn"
          onClick={onOpenPinModal}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
            showAdultContent
              ? 'bg-[#D4145A]/20 text-[#D4145A] border-[#D4145A]/50 shadow-[0_0_10px_rgba(212,20,90,0.3)]'
              : 'bg-[#111] text-[#777] border-[#222] hover:text-[#bbb] hover:border-[#333]'
          }`}
          title="เปิด/ซ่อนหมวดหมู่ 18+ ป้องกันด้วยรหัส PIN"
        >
          {showAdultContent ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-[#D4145A]" />
              <span className="hidden lg:inline font-bold">18+ เปิด</span>
            </>
          ) : (
            <>
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">ซ่อน 18+</span>
            </>
          )}
        </button>

        {/* M3U Plus Export Download */}
        {creds && (
          <a
            id="navbar-m3u-export-btn"
            href={m3uUrl}
            download="playid_playlist.m3u"
            className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#111] hover:bg-[#1a1a1a] text-[#aaa] hover:text-white text-xs font-medium border border-[#222] transition-all"
            title="ส่งออก/ดาวน์โหลดเพลย์ลิสต์ M3U Plus สำหรับเปิดในแอปภายนอก"
          >
            <Download className="w-3.5 h-3.5 text-[#00FF00]" />
            <span>M3U Plus</span>
          </a>
        )}

        {/* User Account / Re-login */}
        {creds ? (
          <div className="flex items-center gap-2 pl-1 border-l border-[#222]">
            <div
              onClick={onOpenLogin}
              className="cursor-pointer flex items-center gap-2 p-1.5 rounded-xl hover:bg-[#111] border border-transparent hover:border-[#222] transition-all"
              title={`บัญชี: ${creds.username} (หมดอายุ: ${expDateStr})`}
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-[#FF6321] to-[#D4145A] text-white flex items-center justify-center font-black text-xs shadow-md">
                {creds.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden 2xl:block text-left">
                <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[100px]">
                  {creds.username}
                </span>
                <span className="text-[10px] text-[#FF6321] block leading-tight font-mono">
                  {expDateStr}
                </span>
              </div>
            </div>

            <button
              id="navbar-logout-btn"
              onClick={onLogout}
              className="p-2 rounded-xl text-[#777] hover:text-red-400 hover:bg-[#111] transition-all"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            id="navbar-login-btn"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FF6321] hover:bg-[#ff763a] text-black font-black text-xs transition-all shadow-md shadow-[#FF6321]/30"
          >
            <User className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
};

