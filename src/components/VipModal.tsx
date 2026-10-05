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
        className="relative w-full max-w-3xl max-h-[90vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-gradient-to-r from-amber-500/10 via-neutral-950 to-neutral-950">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-neutral-950 flex items-center justify-center shadow-lg shadow-amber-500/30">
              <Crown className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">
                  แพ็กเกจสมาชิก PlayID VIP
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  4K ULTRA HD
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                ปลดล็อกช่องรายการสดระดับพรีเมียม กีฬาครบทุกแมตช์ หนังและซีรีส์ไม่มีสะดุด
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-neutral-800 hover:bg-neutral-700 text-white flex items-center justify-center"
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
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/50 shadow-xl'
                          : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2.5 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-gradient-to-r from-amber-400 to-orange-500 text-neutral-950 shadow">
                          ★ แนะนำยอดนิยม
                        </div>
                      )}

                      <div className="space-y-2">
                        <h4 className="text-sm font-bold text-white">{pkg.name}</h4>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl font-black text-amber-400">
                            ฿{pkg.price}
                          </span>
                          <span className="text-xs text-neutral-400">/ {pkg.duration}</span>
                        </div>

                        <ul className="space-y-1.5 pt-2 border-t border-neutral-800/80">
                          {pkg.features.map((feat, i) => (
                            <li key={i} className="flex items-start gap-1.5 text-[11px] text-neutral-300">
                              <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        onClick={() => setSelectedPkg(pkg)}
                        className={`w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          isSelected
                            ? 'bg-amber-400 text-neutral-950 shadow-md'
                            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
                        }`}
                      >
                        {isSelected ? 'เลือกแพ็กเกจนี้แล้ว' : 'เลือกแพ็กเกจ'}
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* PromptPay QR Code Payment Section */}
              <div className="p-5 rounded-2xl bg-neutral-950/80 border border-neutral-800 flex flex-col md:flex-row items-center gap-6">
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
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <QrCode className="w-4 h-4 text-emerald-400" />
                      <span>สแกนชำระเงินผ่าน PromptPay QR Code</span>
                    </h3>
                    <p className="text-xs text-neutral-400">
                      สแกนด้วยแอปธนาคารใดก็ได้ ยอดเงินตรงตามที่ระบุ บัญชีจะได้รับการต่ออายุอัตโนมัติ
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs bg-neutral-900 p-3 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-500 block">แพ็กเกจที่เลือก:</span>
                      <span className="font-semibold text-white">{selectedPkg.name}</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">ยอดชำระ:</span>
                      <span className="font-bold text-amber-400 text-sm">฿{selectedPkg.price} บาท</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">ชื่อบัญชี:</span>
                      <span className="font-semibold text-white">PlayID Service Co.</span>
                    </div>
                    <div>
                      <span className="text-neutral-500 block">Username ที่ต่ออายุ:</span>
                      <span className="font-mono text-emerald-400">{currentUsername || 'playidtv2535'}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowSlipUpload(true)}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.99]"
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
                <h3 className="text-lg font-bold text-white">แจ้งการโอนเงิน & แนบสลิป</h3>
                <p className="text-xs text-neutral-400">
                  สำหรับ {selectedPkg.name} ยอดชำระ {selectedPkg.price} บาท
                </p>
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2 animate-fadeIn">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center mx-auto font-bold">
                    <Check className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-emerald-400">
                    แจ้งชำระเงินสำเร็จแล้ว!
                  </h4>
                  <p className="text-xs text-neutral-300">
                    ระบบได้ส่งข้อมูลสลิปเข้าสู่เซิร์ฟเวอร์เรียบร้อยแล้ว อายุการใช้งานจะขยายทันที
                  </p>
                </div>
              ) : (
                <>
                  <div className="p-6 rounded-2xl border-2 border-dashed border-neutral-700 bg-neutral-950/60 text-center cursor-pointer hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setSlipFile(e.target.files?.[0] || null)}
                      className="hidden"
                      id="slip-file-input"
                    />
                    <label htmlFor="slip-file-input" className="cursor-pointer space-y-2 block">
                      <Upload className="w-8 h-8 text-neutral-400 mx-auto" />
                      <div className="text-xs text-neutral-300 font-medium">
                        {slipFile ? (
                          <span className="text-emerald-400 font-bold">{slipFile.name}</span>
                        ) : (
                          'คลิกเพื่อเลือกไฟล์รูปภาพสลิปโอนเงิน'
                        )}
                      </div>
                      <p className="text-[11px] text-neutral-500">รองรับไฟล์ JPG, PNG</p>
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setShowSlipUpload(false)}
                      className="flex-1 py-2.5 rounded-xl bg-neutral-800 text-neutral-300 text-xs font-semibold hover:bg-neutral-700"
                    >
                      ย้อนกลับ
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-neutral-950 text-xs font-bold shadow-lg"
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
