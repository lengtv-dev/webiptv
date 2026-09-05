import React, { useState } from 'react';
import { X, ShieldAlert, Lock, Check, KeyRound, RotateCcw } from 'lucide-react';
import { AppSettings } from '../types';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (settings: Partial<AppSettings>) => void;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
}) => {
  const [pin, setPin] = useState('');
  const [mode, setMode] = useState<'unlock' | 'change'>('unlock');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const targetPin = settings.adultPin || '0000';
    if (pin === targetPin) {
      const nextState = !settings.showAdultContent;
      onUpdateSettings({ showAdultContent: nextState });
      setSuccess(
        nextState
          ? 'ปลดล็อกหมวดหมู่ 18+ สำเร็จแล้ว!'
          : 'ปิดการแสดงหมวดหมู่ 18+ เรียบร้อยแล้ว'
      );
      setTimeout(() => {
        setSuccess(null);
        setPin('');
        onClose();
      }, 1200);
    } else {
      setError('รหัส PIN ไม่ถูกต้อง (ค่าเริ่มต้นคือ 0000)');
    }
  };

  const handleChangePin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (pin !== (settings.adultPin || '0000')) {
      setError('รหัส PIN ปัจจุบันไม่ถูกต้อง');
      return;
    }
    if (newPin.length !== 4 || !/^\d+$/.test(newPin)) {
      setError('รหัส PIN ใหม่ต้องเป็นตัวเลข 4 หลัก');
      return;
    }
    if (newPin !== confirmPin) {
      setError('รหัส PIN ใหม่ไม่ตรงกัน');
      return;
    }

    onUpdateSettings({ adultPin: newPin });
    setSuccess('เปลี่ยนรหัส PIN สำเร็จแล้ว!');
    setTimeout(() => {
      setSuccess(null);
      setMode('unlock');
      setPin('');
      setNewPin('');
      setConfirmPin('');
      onClose();
    }, 1500);
  };

  const handleResetPin = () => {
    onUpdateSettings({ adultPin: '0000' });
    setSuccess('รีเซ็ตรหัส PIN กลับเป็นค่าเริ่มต้น (0000) สำเร็จแล้ว');
    setTimeout(() => setSuccess(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        id="pin-modal-container"
        className="relative w-full max-w-md bg-[#0a0a0a] border border-[#222] rounded-3xl p-6 sm:p-8 shadow-2xl text-neutral-100 space-y-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#D4145A]/15 text-[#D4145A] border border-[#D4145A]/30 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black italic uppercase tracking-tighter text-white">
                {mode === 'unlock' ? 'การเข้าถึงเนื้อหา 18+' : 'เปลี่ยนรหัสผ่าน PIN'}
              </h2>
              <p className="text-xs text-[#777] font-medium">
                {mode === 'unlock'
                  ? 'ระบบป้องกันด้วยรหัสผ่าน PIN 4 หลัก'
                  : 'ตั้งรหัสความปลอดภัยใหม่สำหรับหมวดหมู่ 18+'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Status Notification */}
        {error && (
          <div className="p-3 rounded-xl bg-red-950/80 border border-red-800 text-red-300 text-xs animate-shake">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 animate-fadeIn">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {mode === 'unlock' ? (
          <form onSubmit={handleUnlock} className="space-y-4">
            <div className="space-y-2 text-center">
              <label className="text-xs font-bold text-[#888] uppercase tracking-wider block">
                กรอกรหัส PIN 4 หลัก (ค่าเริ่มต้น 0000)
              </label>
              <input
                id="pin-unlock-input"
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                autoFocus
                placeholder="••••"
                className="w-44 mx-auto text-center tracking-[1em] text-2xl font-mono py-2.5 px-4 rounded-2xl bg-[#111] border border-[#222] focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] text-[#FF6321] outline-none"
              />
            </div>

            <button
              id="pin-unlock-submit-btn"
              type="submit"
              className={`w-full py-3 rounded-2xl font-black uppercase tracking-wider text-xs text-white transition-all shadow-lg ${
                settings.showAdultContent
                  ? 'bg-[#1a1a1a] hover:bg-[#252525] border border-[#333]'
                  : 'bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 shadow-[#FF6321]/20'
              }`}
            >
              {settings.showAdultContent
                ? 'ยืนยันเพื่อปิดหมวดหมู่ 18+'
                : 'ยืนยันเพื่อปลดล็อกหมวดหมู่ 18+'}
            </button>

            <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a] text-[11px] text-[#777]">
              <button
                type="button"
                onClick={() => {
                  setMode('change');
                  setError(null);
                }}
                className="hover:text-white flex items-center gap-1 font-bold"
              >
                <KeyRound className="w-3 h-3 text-[#FF6321]" />
                <span>เปลี่ยนรหัส PIN</span>
              </button>

              <button
                type="button"
                onClick={handleResetPin}
                className="hover:text-[#FF6321] flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3 h-3" />
                <span>รีเซ็ตรหัสเป็น 0000</span>
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleChangePin} className="space-y-3">
            <div className="space-y-1">
              <label className="text-xs text-[#888] font-bold">รหัส PIN ปัจจุบัน</label>
              <input
                type="password"
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] font-mono py-2 rounded-xl bg-[#111] border border-[#222] text-white outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#888] font-bold">รหัส PIN ใหม่ (4 หลัก)</label>
              <input
                type="password"
                maxLength={4}
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] font-mono py-2 rounded-xl bg-[#111] border border-[#222] text-white outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs text-[#888] font-bold">ยืนยันรหัส PIN ใหม่</label>
              <input
                type="password"
                maxLength={4}
                value={confirmPin}
                onChange={(e) => setConfirmPin(e.target.value)}
                placeholder="••••"
                className="w-full text-center tracking-[0.5em] font-mono py-2 rounded-xl bg-[#111] border border-[#222] text-white outline-none focus:border-[#FF6321]"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="button"
                onClick={() => setMode('unlock')}
                className="flex-1 py-2.5 rounded-xl bg-[#1a1a1a] text-[#aaa] text-xs font-bold hover:bg-[#252525]"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider shadow"
              >
                บันทึก PIN ใหม่
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
