import React from 'react';
import { Palette, X, Check } from 'lucide-react';
import { AppThemeConfig } from '../types';
import { THEME_PRESETS } from '../data/templates';

interface ThemeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: AppThemeConfig;
  onSelectTheme: (theme: AppThemeConfig) => void;
}

export const ThemeModal: React.FC<ThemeModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onSelectTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-3xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-gradient-to-r from-[#141414] to-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6321] to-[#D4145A] flex items-center justify-center text-white shadow-lg shadow-[#FF6321]/20">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">ปรับแต่งธีม & ระบบสี</h2>
              <p className="text-xs text-neutral-400">
                เลือกรูปแบบโทนสี ความโค้งมน และฟอนต์สำหรับแอพของคุณ
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#1a1a1a]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Presets List */}
        <div className="p-6 space-y-4">
          <div className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            โทนสีสำเร็จรูป (Color Presets)
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {THEME_PRESETS.map((t) => {
              const isSelected = currentTheme.id === t.id;
              return (
                <div
                  key={t.id}
                  onClick={() => {
                    onSelectTheme(t);
                    onClose();
                  }}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'bg-[#181818] border-[#FF6321] ring-2 ring-[#FF6321]/20'
                      : 'bg-[#141414] border-[#262626] hover:border-[#383838]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-white">{t.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#FF6321]" />}
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.primaryColor }}
                      title="สีหลัก (Primary)"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.secondaryColor }}
                      title="สีรอง (Secondary)"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.backgroundColor }}
                      title="พื้นหลัง (Background)"
                    />
                    <div
                      className="w-6 h-6 rounded-full border border-white/20 shadow-sm"
                      style={{ backgroundColor: t.surfaceColor }}
                      title="พื้นผิวการ์ด (Surface)"
                    />
                  </div>

                  <div className="text-[11px] text-neutral-400">
                    ฟอนต์: <span className="text-neutral-200">{t.fontFamily}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Custom Color */}
          <div className="pt-4 border-t border-[#222222] space-y-3">
            <div className="text-xs font-bold text-neutral-300">
              ปรับสีหลักเฉพาะคุณ (Custom Primary Color)
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={currentTheme.primaryColor}
                onChange={(e) =>
                  onSelectTheme({
                    ...currentTheme,
                    primaryColor: e.target.value,
                  })
                }
                className="w-10 h-10 rounded-xl cursor-pointer bg-transparent border-0"
              />
              <span className="text-xs font-mono text-neutral-300 uppercase">
                {currentTheme.primaryColor}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
