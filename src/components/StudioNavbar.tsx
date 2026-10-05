import React from 'react';
import {
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Code2,
  Eye,
  Wrench,
  Download,
  FolderOpen,
  Plus,
  Palette,
  LayoutGrid,
  Check,
  Share2,
} from 'lucide-react';
import { AppProject, DeviceView, StudioMode } from '../types';

interface StudioNavbarProps {
  project: AppProject;
  savedProjects: AppProject[];
  mode: StudioMode;
  onSetMode: (mode: StudioMode) => void;
  deviceView: DeviceView;
  onSetDeviceView: (device: DeviceView) => void;
  onSelectProject: (id: string) => void;
  onNewProject: () => void;
  onOpenAiModal: () => void;
  onOpenTemplatesModal: () => void;
  onOpenThemeModal: () => void;
  onOpenExportModal: () => void;
  isSaving?: boolean;
}

export const StudioNavbar: React.FC<StudioNavbarProps> = ({
  project,
  savedProjects,
  mode,
  onSetMode,
  deviceView,
  onSetDeviceView,
  onSelectProject,
  onNewProject,
  onOpenAiModal,
  onOpenTemplatesModal,
  onOpenThemeModal,
  onOpenExportModal,
  isSaving = false,
}) => {
  return (
    <header className="h-16 bg-[#0c0c0c] border-b border-[#222222] px-4 flex items-center justify-between gap-3 select-none z-40 relative">
      {/* Brand & Project Selector */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#FF6321] to-[#D4145A] flex items-center justify-center text-white shadow-lg shadow-[#FF6321]/20 font-black text-lg">
            ⚡
          </div>
          <div className="hidden sm:block">
            <div className="text-sm font-black tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>APP STUDIO</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#FF6321]/20 text-[#FF6321] font-semibold border border-[#FF6321]/30">
                PRO
              </span>
            </div>
            <div className="text-[11px] text-neutral-400">ระบบสร้างแอพพลิเคชั่น</div>
          </div>
        </div>

        <div className="h-6 w-px bg-[#222222] hidden md:block" />

        {/* Project Selector */}
        <div className="relative group">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#2a2a2a] text-xs font-semibold text-neutral-200 cursor-pointer transition-colors max-w-[200px] sm:max-w-[240px]">
            <FolderOpen className="w-3.5 h-3.5 text-[#FF6321] shrink-0" />
            <span className="truncate">{project.name}</span>
          </div>

          {/* Project Dropdown */}
          <div className="absolute left-0 top-full mt-1.5 w-64 bg-[#111111] border border-[#262626] rounded-2xl shadow-2xl p-2 hidden group-hover:block z-50">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider px-2 py-1">
              โปรเจกต์ของคุณ ({savedProjects.length})
            </div>
            <div className="max-h-48 overflow-y-auto space-y-1 py-1">
              {savedProjects.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectProject(p.id)}
                  className={`w-full text-left px-2.5 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                    p.id === project.id
                      ? 'bg-[#FF6321]/15 text-[#FF6321] font-bold'
                      : 'text-neutral-300 hover:bg-[#1a1a1a]'
                  }`}
                >
                  <span className="truncate">{p.name}</span>
                  {p.id === project.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                </button>
              ))}
            </div>
            <div className="border-t border-[#222222] pt-1.5 mt-1">
              <button
                onClick={onNewProject}
                className="w-full px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-[#FF6321] to-[#D4145A] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>สร้างแอพใหม่ (New App)</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Center: Mode Switcher & Device Switcher */}
      <div className="flex items-center gap-3">
        {/* Studio Modes */}
        <div className="bg-[#141414] border border-[#222222] rounded-xl p-1 flex items-center gap-1">
          <button
            onClick={() => onSetMode('builder')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'builder'
                ? 'bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="โหมดออกแบบ ปรับแต่งคอมโพเนนต์"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ออกแบบ</span>
          </button>
          <button
            onClick={() => onSetMode('preview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'preview'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="โหมดทดสอบและเล่นแอพพลิเคชั่นจริง"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ทดสอบแอพ</span>
          </button>
          <button
            onClick={() => onSetMode('code')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
              mode === 'code'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-neutral-400 hover:text-white'
            }`}
            title="ดูโค้ด React + Tailwind"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">ดูโค้ด</span>
          </button>
        </div>

        {/* Device View Switcher (Only in builder & preview mode) */}
        {mode !== 'code' && (
          <div className="hidden lg:flex items-center bg-[#141414] border border-[#222222] rounded-xl p-1 gap-0.5">
            <button
              onClick={() => onSetDeviceView('mobile')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceView === 'mobile' ? 'bg-[#222222] text-[#FF6321]' : 'text-neutral-400 hover:text-white'
              }`}
              title="หน้าจอมือถือ (Mobile 390px)"
            >
              <Smartphone className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetDeviceView('tablet')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceView === 'tablet' ? 'bg-[#222222] text-[#FF6321]' : 'text-neutral-400 hover:text-white'
              }`}
              title="หน้าจอแท็บเล็ต (Tablet 768px)"
            >
              <Tablet className="w-4 h-4" />
            </button>
            <button
              onClick={() => onSetDeviceView('desktop')}
              className={`p-1.5 rounded-lg text-xs transition-all ${
                deviceView === 'desktop' ? 'bg-[#222222] text-[#FF6321]' : 'text-neutral-400 hover:text-white'
              }`}
              title="หน้าจอคอมพิวเตอร์ (Desktop)"
            >
              <Monitor className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Action Tools */}
      <div className="flex items-center gap-2">
        {/* AI Generator Button */}
        <button
          onClick={onOpenAiModal}
          className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-[#FF6321]/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden md:inline">สร้างด้วย AI</span>
        </button>

        {/* Templates */}
        <button
          onClick={onOpenTemplatesModal}
          className="px-2.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors"
          title="เลือกจากเทมเพลตสำเร็จรูป"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">เทมเพลต</span>
        </button>

        {/* Theme */}
        <button
          onClick={onOpenThemeModal}
          className="px-2.5 py-1.5 rounded-xl bg-[#141414] hover:bg-[#1f1f1f] border border-[#2a2a2a] text-xs font-semibold text-neutral-300 flex items-center gap-1.5 transition-colors"
          title="ปรับแต่งธีมและสีสัน"
        >
          <Palette className="w-3.5 h-3.5 text-neutral-400" />
          <span className="hidden sm:inline">ธีมสี</span>
        </button>

        {/* Export Code */}
        <button
          onClick={onOpenExportModal}
          className="px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333333] text-xs font-bold text-white flex items-center gap-1.5 transition-all"
        >
          <Download className="w-3.5 h-3.5 text-emerald-400" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
