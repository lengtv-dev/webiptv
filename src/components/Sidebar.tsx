import React from 'react';
import {
  Radio,
  Film,
  Tv,
  Heart,
  History,
  Calendar,
  Crown,
  Info,
  Server,
  Download,
} from 'lucide-react';
import { XtreamAuthResponse, XtreamCredentials } from '../types';
import { getM3uPlaylistExportUrl } from '../services/api';

export type ActiveTab = 'live' | 'vod' | 'series' | 'favorites' | 'history';

interface SidebarProps {
  activeTab: ActiveTab;
  onSelectTab: (tab: ActiveTab) => void;
  favoritesCount: number;
  historyCount: number;
  onOpenSports: () => void;
  onOpenVip: () => void;
  authData: XtreamAuthResponse | null;
  creds: XtreamCredentials | null;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  favoritesCount,
  historyCount,
  onOpenSports,
  onOpenVip,
  authData,
  creds,
}) => {
  const navItems = [
    {
      id: 'live' as ActiveTab,
      label: 'ช่องทีวีสด',
      subtitle: 'Live TV',
      icon: Radio,
      badge: 'LIVE',
      badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
    },
    {
      id: 'vod' as ActiveTab,
      label: 'ภาพยนตร์',
      subtitle: 'Movies VOD',
      icon: Film,
    },
    {
      id: 'series' as ActiveTab,
      label: 'ซีรีส์',
      subtitle: 'Series & Shows',
      icon: Tv,
    },
    {
      id: 'favorites' as ActiveTab,
      label: 'รายการโปรด',
      subtitle: 'Bookmarks',
      icon: Heart,
      count: favoritesCount,
      countColor: 'bg-[#D4145A] text-white shadow-[0_0_10px_rgba(212,20,90,0.4)]',
    },
    {
      id: 'history' as ActiveTab,
      label: 'ประวัติการดู',
      subtitle: 'Watch History',
      icon: History,
      count: historyCount,
      countColor: 'bg-[#222] text-[#ccc]',
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        id="app-desktop-sidebar"
        className="hidden md:flex flex-col w-64 h-[calc(100vh-4.5rem)] sticky top-18 bg-[#000] border-r border-[#1a1a1a] p-4 justify-between flex-shrink-0 select-none overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-2">
            <span className="text-[10px] font-black text-[#666] uppercase tracking-widest px-3 mb-2 block">
              โหมดความบันเทิงหลัก
            </span>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-sm transition-all group ${
                    isActive
                      ? 'bg-gradient-to-r from-[#FF6321]/20 to-[#D4145A]/15 border border-[#FF6321]/50 text-white shadow-lg shadow-[#FF6321]/15'
                      : 'text-[#888] hover:text-white hover:bg-[#111]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 transition-transform group-hover:scale-105 ${
                        isActive
                          ? 'text-[#FF6321] stroke-[2.5]'
                          : item.id === 'favorites'
                          ? 'text-[#D4145A]'
                          : 'text-[#666] group-hover:text-white'
                      }`}
                    />
                    <div className="text-left leading-tight">
                      <div className="tracking-tight">{item.label}</div>
                      <div
                        className={`text-[10px] font-normal ${
                          isActive ? 'text-[#FF6321]' : 'text-[#555]'
                        }`}
                      >
                        {item.subtitle}
                      </div>
                    </div>
                  </div>

                  {/* Real-time Badge / Count */}
                  {item.count !== undefined && item.count > 0 && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${item.countColor}`}
                    >
                      {item.count}
                    </span>
                  )}

                  {item.badge && (
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Features */}
          <div className="space-y-1.5 pt-4 border-t border-[#1a1a1a]">
            <span className="text-[10px] font-black text-[#666] uppercase tracking-widest px-3 mb-2 block">
              ฟังก์ชันพิเศษ
            </span>

            <button
              id="sidebar-sports-btn"
              onClick={onOpenSports}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-[#aaa] hover:text-white hover:bg-[#111] border border-transparent hover:border-[#222] transition-all group"
            >
              <Calendar className="w-5 h-5 text-[#FF6321] group-hover:scale-110 transition-transform" />
              <div className="text-left leading-tight">
                <div>ตารางถ่ายทอดสดกีฬา</div>
                <div className="text-[10px] text-[#555]">Live Sports Fixtures</div>
              </div>
            </button>

            <button
              id="sidebar-vip-btn"
              onClick={onOpenVip}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-[#FF6321] hover:text-orange-400 hover:bg-[#FF6321]/10 border border-transparent hover:border-[#FF6321]/30 transition-all group"
            >
              <Crown className="w-5 h-5 text-[#FF6321] group-hover:scale-110 transition-transform" />
              <div className="text-left leading-tight">
                <div className="font-bold">แพ็กเกจสมาชิก VIP</div>
                <div className="text-[10px] text-[#FF6321]/70">PromptPay QR Code</div>
              </div>
            </button>

            {creds && (
              <a
                href={getM3uPlaylistExportUrl(creds)}
                download="playid_playlist.m3u"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-sm font-semibold text-[#aaa] hover:text-white hover:bg-[#111] border border-transparent hover:border-[#222] transition-all group"
              >
                <Download className="w-5 h-5 text-[#00FF00] group-hover:scale-110 transition-transform" />
                <div className="text-left leading-tight">
                  <div>ส่งออกเพลย์ลิสต์ M3U</div>
                  <div className="text-[10px] text-[#555]">สำหรับ VLC / Smarters</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Server & Connection Health Card */}
        <div className="pt-4 border-t border-[#1a1a1a] space-y-2 text-xs">
          <div className="p-3.5 rounded-2xl bg-[#0a0a0a] border border-[#1a1a1a] space-y-2">
            <div className="flex items-center justify-between text-[#888]">
              <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px]">
                <Server className="w-3.5 h-3.5 text-[#00FF00]" />
                เซิร์ฟเวอร์
              </span>
              <span className="w-2 h-2 rounded-full bg-[#00FF00] shadow-[0_0_8px_#00FF00] animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-[#00FF00] truncate">
              {creds?.server_url || '103.114.203.129:8080'}
            </p>
            <div className="flex items-center justify-between text-[11px] text-[#777] pt-1.5 border-t border-[#161616]">
              <span>สถานะบัญชี</span>
              <span className="text-[#FF6321] font-mono font-bold">
                {authData?.user_info?.status || 'Active VIP'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Responsive Tab Bar) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#000]/95 backdrop-blur-xl border-t border-[#1a1a1a] px-2 py-2 flex items-center justify-around select-none shadow-2xl"
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`mobile-nav-tab-${item.id}`}
              onClick={() => onSelectTab(item.id)}
              className={`relative flex flex-col items-center justify-center p-1.5 rounded-xl transition-all ${
                isActive ? 'text-[#FF6321] font-bold' : 'text-[#777] hover:text-[#bbb]'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#D4145A] text-white">
                    {item.count}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 whitespace-nowrap">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
};
