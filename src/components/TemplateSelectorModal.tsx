import React from 'react';
import { LayoutGrid, X, ArrowRight, Sparkles, Check } from 'lucide-react';
import { AppProject } from '../types';
import { APP_TEMPLATES } from '../data/templates';

interface TemplateSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (project: AppProject) => void;
  currentProjectId: string;
}

export const TemplateSelectorModal: React.FC<TemplateSelectorModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  currentProjectId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-gradient-to-r from-[#141414] to-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6321] to-[#D4145A] flex items-center justify-center text-white shadow-lg shadow-[#FF6321]/20">
              <LayoutGrid className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">คลังเทมเพลตแอพพลิเคชั่นสำเร็จรูป</h2>
              <p className="text-xs text-neutral-400">
                เลือกเทมเพลตที่ออกแบบไว้พร้อมใช้งาน เพื่อเริ่มต้นปรับแต่งและต่อยอดแอพของคุณได้ทันที
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

        {/* Template Cards Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {APP_TEMPLATES.map((tmpl) => {
            const isCurrent = currentProjectId === tmpl.project.id;
            return (
              <div
                key={tmpl.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between space-y-4 transition-all group hover:scale-[1.02] cursor-pointer ${
                  isCurrent
                    ? 'bg-[#181818] border-[#FF6321]'
                    : 'bg-[#141414] border-[#262626] hover:border-[#3a3a3a]'
                }`}
                onClick={() => {
                  const cloned: AppProject = JSON.parse(JSON.stringify(tmpl.project));
                  cloned.id = `proj-${Date.now()}`;
                  onSelectTemplate(cloned);
                  onClose();
                }}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#FF6321] px-2.5 py-0.5 rounded-md bg-[#FF6321]/10 border border-[#FF6321]/20">
                      {tmpl.category}
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-neutral-800 text-neutral-300">
                      {tmpl.badge}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-sm text-white group-hover:text-[#FF6321] transition-colors">
                    {tmpl.nameTh}
                  </h3>

                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {tmpl.descriptionTh}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#222222] flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500 font-medium">
                    {tmpl.project.pages[0]?.components.length || 0} คอมโพเนนต์
                  </span>
                  <button className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#202020] group-hover:bg-[#FF6321] text-white transition-colors flex items-center gap-1">
                    <span>ใช้เทมเพลตนี้</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
