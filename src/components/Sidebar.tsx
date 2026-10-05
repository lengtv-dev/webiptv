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
      countColor: 'bg-pink-600 text-white shadow-pink-600/40',
    },
    {
      id: 'history' as ActiveTab,
      label: 'ประวัติการดู',
      subtitle: 'Watch History',
      icon: History,
      count: historyCount,
      countColor: 'bg-neutral-700 text-neutral-200',
    },
  ];

  return (
    <>
      {/* Desktop & Tablet Sidebar */}
      <aside
        id="app-desktop-sidebar"
        className="hidden md:flex flex-col w-64 h-[calc(100vh-4rem)] sticky top-16 bg-neutral-900/60 border-r border-neutral-800/80 p-4 justify-between flex-shrink-0 select-none overflow-y-auto"
      >
        <div className="space-y-6">
          {/* Main Navigation */}
          <div className="space-y-1.5">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2 block">
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
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all group ${
                    isActive
                      ? 'bg-emerald-500 text-neutral-950 font-bold shadow-lg shadow-emerald-500/20'
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/70'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={`w-5 h-5 ${
                        isActive
                          ? 'text-neutral-950 stroke-[2.5]'
                          : item.id === 'favorites'
                          ? 'text-pink-400 group-hover:scale-110 transition-transform'
                          : 'text-neutral-400 group-hover:text-emerald-400 transition-colors'
                      }`}
                    />
                    <div className="text-left leading-tight">
                      <div>{item.label}</div>
                      <div
                        className={`text-[10px] font-normal ${
                          isActive ? 'text-neutral-900' : 'text-neutral-500'
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
                      className={`px-1.5 py-0.2 rounded text-[10px] font-bold border ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Secondary Features */}
          <div className="space-y-1.5 pt-4 border-t border-neutral-800/80">
            <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-3 mb-2 block">
              ฟังก์ชันพิเศษ
            </span>

            <button
              id="sidebar-sports-btn"
              onClick={onOpenSports}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/70 transition-all group"
            >
              <Calendar className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <div className="text-left leading-tight">
                <div>ตารางถ่ายทอดสดกีฬา</div>
                <div className="text-[10px] text-neutral-500">Live Sports Fixtures</div>
              </div>
            </button>

            <button
              id="sidebar-vip-btn"
              onClick={onOpenVip}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-amber-300 hover:text-amber-200 hover:bg-amber-500/10 transition-all group"
            >
              <Crown className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
              <div className="text-left leading-tight">
                <div>แพ็กเกจสมาชิก VIP</div>
                <div className="text-[10px] text-amber-500/80">PromptPay QR Code</div>
              </div>
            </button>

            {creds && (
              <a
                href={getM3uPlaylistExportUrl(creds)}
                download="playid_playlist.m3u"
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium text-neutral-300 hover:text-white hover:bg-neutral-800/70 transition-all group"
              >
                <Download className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <div className="text-left leading-tight">
                  <div>ส่งออกเพลย์ลิสต์ M3U</div>
                  <div className="text-[10px] text-neutral-500">สำหรับ VLC / Smarters</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Server & Connection Health Card */}
        <div className="pt-4 border-t border-neutral-800/80 space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-1.5">
            <div className="flex items-center justify-between text-neutral-400">
              <span className="flex items-center gap-1.5">
                <Server className="w-3.5 h-3.5 text-emerald-400" />
                เซิร์ฟเวอร์
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-mono text-neutral-300 truncate">
              {creds?.serverUrl || '103.114.203.129:8080'}
            </p>
            <div className="flex items-center justify-between text-[11px] text-neutral-400 pt-1 border-t border-neutral-900">
              <span>สถานะบัญชี</span>
              <span className="text-emerald-400 font-semibold">
                {authData?.user_info?.status || 'Active VIP'}
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile Bottom Navigation (Responsive Tab Bar) */}
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-neutral-900/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-1.5 flex items-center justify-around select-none"
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
                isActive ? 'text-emerald-400 font-bold' : 'text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <div className="relative">
                <Icon className="w-5 h-5" />
                {item.count !== undefined && item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2 px-1.5 py-0.2 rounded-full text-[10px] font-extrabold bg-pink-600 text-white">
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
