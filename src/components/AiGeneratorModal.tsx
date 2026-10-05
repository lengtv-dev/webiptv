import React, { useState } from 'react';
import { Sparkles, X, Wand2, ArrowRight, Loader2, Lightbulb } from 'lucide-react';
import { AppProject } from '../types';
import { generateAppFromPrompt } from '../services/appGenerator';

interface AiGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAppGenerated: (project: AppProject) => void;
}

const SAMPLE_PROMPTS = [
  { label: '☕ ร้านกาแฟ & คาเฟ่', text: 'สร้างแอพร้านกาแฟสเปเชียลตี้ มีเมนูกาแฟสด ขนมเบเกอรี่ ตะกร้าสั่งซื้อ และฟอร์มจองโต๊ะ' },
  { label: '📊 แดชบอร์ดบริหารสต็อก', text: 'สร้างระบบแดชบอร์ดจัดการยอดขาย สต็อกสินค้า กราฟตัวชี้วัด และตารางคำสั่งซื้อแบบเรียลไทม์' },
  { label: '🛒 ร้านเสื้อผ้าสตรีทแวร์', text: 'สร้างเว็บร้านค้าออนไลน์แฟชั่นวัยรุ่น มีคอลเลกชันใหม่ ตะกร้าสินค้า และรีวิวคะแนนจากลูกค้า' },
  { label: '🏥 คลินิก & นัดหมอ', text: 'สร้างแอพคลินิกทันตกรรมและความงาม มีตารางนัดหมายแพทย์ ข้อมูลบริการ และฟอร์มจองคิวตรวจ' },
  { label: '📋 กระดานงานโปรเจกต์', text: 'สร้างระบบกระดานงาน Kanban สำหรับทีมพัฒนาซอฟต์แวร์ แยกสถานะงาน สมาชิก และเดดไลน์' },
  { label: '🎬 ศูนย์รวมสตรีมมิ่ง', text: 'สร้างเว็บศูนย์รวมสตรีมมิ่งวิดีโอ มีหมวดหมู่ภาพยนตร์ เครื่องเล่นวิดีโอ 4K และแผนสมาชิก VIP' },
];

export const AiGeneratorModal: React.FC<AiGeneratorModalProps> = ({
  isOpen,
  onClose,
  onAppGenerated,
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressMsg, setProgressMsg] = useState('');

  if (!isOpen) return null;

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;

    setIsGenerating(true);
    setProgressMsg('กำลังวิเคราะห์โครงสร้างแอพพลิเคชั่น...');

    try {
      setTimeout(() => setProgressMsg('กำลังออกแบบหน้าจอและคอมโพเนนต์...'), 1200);
      setTimeout(() => setProgressMsg('กำลังจัดเตรียมข้อมูลจำลองและธีมสี...'), 2400);

      const generated = await generateAppFromPrompt(prompt);
      onAppGenerated(generated);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
      setProgressMsg('');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-gradient-to-r from-[#141414] to-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6321] to-[#D4145A] flex items-center justify-center text-white shadow-lg shadow-[#FF6321]/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">สร้างแอพพลิเคชั่นด้วย AI</h2>
              <p className="text-xs text-neutral-400">
                พิมพ์คำสั่งภาษาไทยหรืออังกฤษ AI จะสร้างโครงสร้างแอพ คอมโพเนนต์ และข้อมูลให้ทันที
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isGenerating}
            className="p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-[#1a1a1a] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {/* Prompt Input Area */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-neutral-300 flex items-center justify-between">
              <span>อธิบายแอพที่คุณต้องการสร้าง:</span>
              <span className="text-[11px] text-neutral-500 font-normal">เช่น ระบบร้านค้า, บอร์ดงาน, คลินิก</span>
            </label>
            <textarea
              rows={4}
              disabled={isGenerating}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="ตัวอย่าง: สร้างแอพสั่งอาหารคลีน มีเมนูลดน้ำหนัก คำนวณแคลอรี ตะกร้าสั่งซื้อ และฟอร์มกรอกที่อยู่จัดส่ง..."
              className="w-full p-4 rounded-2xl bg-[#141414] border border-[#2a2a2a] text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-[#FF6321] leading-relaxed resize-none transition-all shadow-inner"
            />
          </div>

          {/* Sample Prompts */}
          <div className="space-y-2.5">
            <div className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>หรือเลือกไอเดียเริ่มต้น:</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SAMPLE_PROMPTS.map((sample, i) => (
                <button
                  key={i}
                  disabled={isGenerating}
                  onClick={() => setPrompt(sample.text)}
                  className="p-2.5 rounded-xl bg-[#141414] hover:bg-[#1a1a1a] border border-[#242424] hover:border-[#333333] text-left transition-all group"
                >
                  <div className="text-xs font-bold text-neutral-200 group-hover:text-[#FF6321] transition-colors">
                    {sample.label}
                  </div>
                  <div className="text-[11px] text-neutral-500 line-clamp-1 mt-0.5">
                    {sample.text}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Generating Indicator */}
          {isGenerating && (
            <div className="p-4 rounded-2xl bg-[#141414] border border-[#FF6321]/30 flex items-center gap-3 animate-pulse">
              <Loader2 className="w-5 h-5 text-[#FF6321] animate-spin shrink-0" />
              <div className="text-xs font-semibold text-neutral-300">
                {progressMsg}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-[#222222] bg-[#0c0c0c] flex items-center justify-end gap-3">
          <button
            type="button"
            disabled={isGenerating}
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white transition-colors"
          >
            ยกเลิก
          </button>
          <button
            type="button"
            disabled={!prompt.trim() || isGenerating}
            onClick={handleGenerate}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white text-xs font-bold shadow-lg shadow-[#FF6321]/20 hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>กำลังสร้างแอพ...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>สร้างแอพเดี๋ยวนี้</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
