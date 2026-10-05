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
import { XtreamAuthResponse, XtreamCredentials } from '../types';
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
      className="sticky top-0 z-40 w-full h-16 bg-neutral-900/90 dark:bg-neutral-950/90 border-b border-neutral-800 backdrop-blur-xl px-4 sm:px-6 flex items-center justify-between gap-3 text-neutral-100 select-none"
    >
      {/* Brand Logo & Profile Name */}
      <div className="flex items-center gap-3 flex-shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-neutral-950 shadow-md shadow-emerald-500/20">
          <Tv className="w-5 h-5 font-bold" />
        </div>
        <div className="hidden sm:block">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-base tracking-tight text-white">
              PlayID IPTV
            </span>
            <span className="px-1.5 py-0.2 text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded">
              PRO
            </span>
          </div>
          <p className="text-[11px] text-neutral-400 font-medium">
            {creds?.anyname || 'Xtream Codes Player'}
          </p>
        </div>
      </div>

      {/* Global Search Input */}
      <div className="flex-1 max-w-md mx-2 sm:mx-6">
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            id="navbar-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ค้นหาช่องทีวีสด, หนัง VOD, ซีรีส์..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-neutral-950/80 border border-neutral-800 focus:border-emerald-500 text-xs sm:text-sm text-neutral-200 placeholder-neutral-500 outline-none transition-all focus:ring-1 focus:ring-emerald-500"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2.5">
        {/* Live Sports Schedule Button */}
        <button
          id="navbar-sports-btn"
          onClick={onOpenSports}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold border border-neutral-700/80 transition-all shadow-sm"
          title="ตารางถ่ายทอดสดฟุตบอลและกีฬา"
        >
          <Calendar className="w-3.5 h-3.5 text-emerald-400" />
          <span className="hidden md:inline">ตารางกีฬา</span>
        </button>

        {/* VIP Packages Button */}
        <button
          id="navbar-vip-btn"
          onClick={onOpenVip}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 text-amber-300 text-xs font-semibold border border-amber-500/40 transition-all shadow-sm"
          title="ดูแพ็กเกจสมาชิก VIP"
        >
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">แพ็กเกจ VIP</span>
        </button>

        {/* 18+ Adult Content PIN Toggle */}
        <button
          id="navbar-adult-pin-btn"
          onClick={onOpenPinModal}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
            showAdultContent
              ? 'bg-red-500/20 text-red-400 border-red-500/40'
              : 'bg-neutral-800/80 text-neutral-400 border-neutral-700 hover:text-neutral-200'
          }`}
          title="เปิด/ซ่อนหมวดหมู่ 18+ ป้องกันด้วยรหัส PIN"
        >
          {showAdultContent ? (
            <>
              <ShieldAlert className="w-3.5 h-3.5 text-red-400" />
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
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 text-xs font-medium border border-neutral-700 transition-all"
            title="ส่งออก/ดาวน์โหลดเพลย์ลิสต์ M3U Plus สำหรับเปิดในแอปภายนอก"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden xl:inline">M3U Plus</span>
          </a>
        )}

        {/* Theme Toggle */}
        <button
          id="navbar-theme-toggle-btn"
          onClick={onToggleTheme}
          className="p-2 rounded-xl bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 transition-all border border-neutral-700"
          title={theme === 'dark' ? 'เปลี่ยนเป็นโหมดสว่าง (Light)' : 'เปลี่ยนเป็นโหมดมืด (Dark)'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-300" />}
        </button>

        {/* User Account / Re-login */}
        {creds ? (
          <div className="flex items-center gap-2 pl-1 border-l border-neutral-800">
            <div
              onClick={onOpenLogin}
              className="cursor-pointer flex items-center gap-2 p-1.5 rounded-xl hover:bg-neutral-800 transition-all"
              title={`บัญชี: ${creds.username} (หมดอายุ: ${expDateStr})`}
            >
              <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-xs">
                {creds.username.slice(0, 2).toUpperCase()}
              </div>
              <div className="hidden 2xl:block text-left">
                <span className="text-xs font-semibold text-white block leading-tight truncate max-w-[100px]">
                  {creds.username}
                </span>
                <span className="text-[10px] text-emerald-400 block leading-tight">
                  VIP: {expDateStr}
                </span>
              </div>
            </div>

            <button
              id="navbar-logout-btn"
              onClick={onLogout}
              className="p-2 rounded-xl text-neutral-400 hover:text-red-400 hover:bg-neutral-800 transition-all"
              title="ออกจากระบบ"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            id="navbar-login-btn"
            onClick={onOpenLogin}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 font-bold text-xs transition-all shadow"
          >
            <User className="w-3.5 h-3.5" />
            <span>เข้าสู่ระบบ</span>
          </button>
        )}
      </div>
    </header>
  );
};
