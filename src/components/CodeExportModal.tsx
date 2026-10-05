import React, { useState } from 'react';
import { Download, Copy, Check, X, FileCode, Sparkles } from 'lucide-react';
import { AppProject } from '../types';
import { generateReactCode } from '../services/appGenerator';

interface CodeExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject;
}

export const CodeExportModal: React.FC<CodeExportModalProps> = ({
  isOpen,
  onClose,
  project,
}) => {
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'react' | 'json'>('react');

  if (!isOpen) return null;

  const reactCode = generateReactCode(project);
  const jsonCode = JSON.stringify(project, null, 2);

  const activeContent = tab === 'react' ? reactCode : jsonCode;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const filename = tab === 'react' ? `${project.name.replace(/\s+/g, '_')}.tsx` : `${project.name.replace(/\s+/g, '_')}.json`;
    const mime = tab === 'react' ? 'text/typescript' : 'application/json';
    const blob = new Blob([activeContent], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="bg-[#0e0e0e] border border-[#2a2a2a] rounded-3xl w-full max-w-4xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#222222] flex items-center justify-between bg-gradient-to-r from-[#141414] to-[#0e0e0e]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#FF6321] to-[#D4145A] flex items-center justify-center text-white shadow-lg shadow-[#FF6321]/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-black text-white">ส่งออกโค้ด (Export Application)</h2>
              <p className="text-xs text-neutral-400">
                ดาวน์โหลดโค้ด React + Tailwind CSS สำหรับนำไปรันบนโปรเจกต์ของคุณได้ทันที
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

        {/* Tab switcher */}
        <div className="px-6 pt-4 border-b border-[#222] flex items-center justify-between bg-[#111]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setTab('react')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                tab === 'react'
                  ? 'border-[#FF6321] text-[#FF6321]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              React Component (App.tsx)
            </button>
            <button
              onClick={() => setTab('json')}
              className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all ${
                tab === 'json'
                  ? 'border-[#FF6321] text-[#FF6321]'
                  : 'border-transparent text-neutral-400 hover:text-white'
              }`}
            >
              Project Data (JSON Schema)
            </button>
          </div>

          <div className="flex items-center gap-2 pb-3">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] text-xs font-bold text-neutral-200 border border-[#333] flex items-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'คัดลอกสำเร็จ!' : 'คัดลอกโค้ด'}</span>
            </button>
            <button
              onClick={handleDownload}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-xs font-bold text-white shadow-md flex items-center gap-1.5 hover:opacity-90"
            >
              <Download className="w-3.5 h-3.5" />
              <span>ดาวน์โหลดไฟล์</span>
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 p-6 overflow-y-auto bg-[#0a0a0a]">
          <pre className="text-[11px] font-mono text-neutral-300 leading-relaxed overflow-x-auto p-4 rounded-2xl bg-[#0e0e0e] border border-[#222]">
            <code>{activeContent}</code>
          </pre>
        </div>
      </div>
    </div>
  );
};
