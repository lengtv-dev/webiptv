import React, { useState } from 'react';
import { X, Crown, Check, QrCode, Sparkles, ShieldCheck, Upload, AlertCircle } from 'lucide-react';
import { VIP_PACKAGES } from '../services/api';
import { VipPackage } from '../types';

interface VipModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUsername?: string;
}

export const VipModal: React.FC<VipModalProps> = ({
  isOpen,
  onClose,
  currentUsername,
}) => {
  const [selectedPkg, setSelectedPkg] = useState<VipPackage>(VIP_PACKAGES[1]); // default to 3-month popular
  const [showSlipUpload, setShowSlipUpload] = useState(false);
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleConfirmPayment = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setShowSlipUpload(false);
      onClose();
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div
        id="vip-modal-container"
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-[#222] rounded-3xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-[#1a1a1a] flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#FF6321] to-[#D4145A] text-white flex items-center justify-center shadow-lg shadow-[#FF6321]/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">
                  แพ็กเกจสมาชิก <span className="text-[#FF6321]">PLAYID VIP</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30">
                  4K ULTRA HD
                </span>
              </div>
              <p className="text-xs text-[#777] font-medium">
                ปลดล็อกช่องรายการสดระดับพรีเมียม กีฬาครบทุกแมตช์ หนังและซีรีส์ไม่มีสะดุด
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {!showSlipUpload ? (
            <>
              {/* Packages Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
                {VIP_PACKAGES.map((pkg) => {
                  const isSelected = selectedPkg.id === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setSelectedPkg(pkg)}
                      className={`relative p-4 rounded-2xl cursor-pointer transition-all border flex flex-col justify-between ${
                        isSelected
                          ? 'bg-[#FF6321]/10 border-[#FF6321] ring-1 ring-[#FF6321]/50 shadow-xl'
                          : 'bg-[#111] border-[#222] hover:border-[#333]'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white shadow">
                          ★ แนะนำยอดนิยม
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white">{pkg.name}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className={`text-2xl font-black ${isSelected ? 'text-[#FF6321]' : 'text-white'}`}>
                            ฿{pkg.price}
                          </span>
                          <span className="text-xs text-[#777]">/ {pkg.duration}</span>
                        </div>

                        <ul className="space-y-1.5 pt-2 border-t border-[#1a1a1a]">
                          {pkg.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-[#aaa]">
                              <Check className="w-3.5 h-3.5 text-[#00FF00] flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setSelectedPkg(pkg)}
                        className={`w-full mt-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                          isSelected
                            ? 'bg-[#FF6321] text-black shadow-md'
                            : 'bg-[#1a1a1a] text-[#888] hover:text-white'
                        }`}
                      >
                        {isSelected ? 'เลือกแพ็กเกจนี้แล้ว' : 'เลือกแพ็กเกจ'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* PromptPay QR Code Payment Section */}
              <div className="p-5 rounded-2xl bg-[#111] border border-[#222] flex flex-col md:flex-row items-center gap-6">
                {/* Visual QR Code Display */}
                <div className="w-48 p-3 rounded-2xl bg-white text-neutral-950 flex flex-col items-center shadow-xl flex-shrink-0 text-center">
                  <div className="bg-[#113566] text-white text-[10px] font-bold py-1 px-3 rounded-md w-full mb-2">
                    PROMPTPAY
                  </div>
                  {/* Generated QR visual */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=PROMPTPAY-0811142031-PLAYID-${selectedPkg.price}`}
                    alt="PromptPay QR Code"
                    className="w-36 h-36 object-contain"
                  />
                  <span className="text-[11px] font-bold text-neutral-800 mt-1">
                    ยอดชำระ: {selectedPkg.price} บาท
                  </span>
                  <span className="text-[9px] text-neutral-500">PlayID IPTV Thailand</span>
                </div>

                {/* Bank details & Instructions */}
                <div className="flex-1 space-y-3 text-sm">
                  <div className="space-y-1">
                    <h3 className="font-black italic uppercase tracking-tighter text-white text-base flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-[#FF6321]" />
                      <span>สแกนชำระเงินผ่าน PromptPay QR Code</span>
                    </h3>
                    <p className="text-xs text-[#777] font-medium">
                      สแกนด้วยแอปธนาคารใดก็ได้ ยอดเงินตรงตามที่ระบุ บัญชีจะได้รับการต่ออายุอัตโนมัติ
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-black p-3.5 rounded-xl border border-[#222]">
                    <div>
                      <span className="text-[#666] block text-[10px] uppercase font-bold">แพ็กเกจที่เลือก:</span>
                      <span className="font-bold text-white">{selectedPkg.name}</span>
                    </div>
                    <div>
                      <span className="text-[#666] block text-[10px] uppercase font-bold">ยอดชำระ:</span>
                      <span className="font-black text-[#FF6321] text-sm">฿{selectedPkg.price} บาท</span>
                    </div>
                    <div>
                      <span className="text-[#666] block text-[10px] uppercase font-bold">ชื่อบัญชี:</span>
                      <span className="font-bold text-white">PlayID Service Co.</span>
                    </div>
                    <div>
                      <span className="text-[#666] block text-[10px] uppercase font-bold">Username ที่ต่ออายุ:</span>
                      <span className="font-mono text-[#00FF00] font-bold">{currentUsername || 'playidtv2535'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSlipUpload(true)}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF6321]/20 transition-all active:scale-[0.99]"
                  >
                    แจ้งชำระเงิน / แนบสลิปโอนเงิน (Upload Slip)
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Slip Upload & Confirmation Form */
            <form onSubmit={handleConfirmPayment} className="max-w-md mx-auto space-y-5 py-4">
              <div className="text-center space-y-1">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-white">แจ้งการโอนเงิน & แนบสลิป</h3>
                <p className="text-xs text-[#777] font-medium">
                  สำหรับ {selectedPkg.name} ยอดชำระ {selectedPkg.price} บาท
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-[#FF6321]/10 border border-[#FF6321]/30 text-center space-y-2 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-[#FF6321] text-black flex items-center justify-center mx-auto font-bold">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-black uppercase text-[#FF6321]">
                    แจ้งชำระเงินสำเร็จแล้ว!
                  </h4>
                  <p className="text-xs text-[#bbb] font-medium">
                    ระบบได้ส่งข้อมูลสลิปเข้าสู่เซิร์ฟเวอร์เรียบร้อยแล้ว อายุการใช้งานจะขยายทันที
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-[#333] bg-black text-center cursor-pointer hover:border-[#FF6321] transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="slip-file-input"
                    />
                    <label htmlFor="slip-file-input" className="cursor-pointer space-y-2 block">
                      <Upload className="w-8 h-8 text-[#555] mx-auto" />
                      <div className="text-xs text-[#aaa] font-bold">
                        {slipFile ? (
                          <span className="text-[#FF6321] font-bold">{slipFile.name}</span>
                        ) : (
                          'คลิกเพื่อเลือกไฟล์รูปภาพสลิปโอนเงิน'
                        )}
                      </div>
                      <p className="text-[11px] text-[#666]">รองรับไฟล์ JPG, PNG</p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSlipUpload(false)}
                      className="flex-1 py-2.5 rounded-xl bg-[#1a1a1a] text-[#aaa] text-xs font-bold hover:bg-[#252525]"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider shadow-lg"
                    >
                      ยืนยันการแจ้งชำระ
                    </button>
                  </div>
                </>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
