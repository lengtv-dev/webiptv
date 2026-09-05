import React from 'react';
import { X, Calendar, Play, Clock, Flame, Radio, Award } from 'lucide-react';
import { MOCK_SPORTS_FIXTURES } from '../services/api';
import { SportFixture } from '../types';

interface SportsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWatchChannel: (channelName: string) => void;
}

export const SportsModal: React.FC<SportsModalProps> = ({
  isOpen,
  onClose,
  onWatchChannel,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div
        id="sports-modal-container"
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-[#0a0a0a] border border-[#222] rounded-3xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-[#1a1a1a] flex items-center justify-between bg-black">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-black italic uppercase tracking-tighter text-white">
                  ตารางถ่ายทอดสดกีฬา <span className="text-[#FF6321]">(Live Sports)</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30">
                  LIVE FIXTURES
                </span>
              </div>
              <p className="text-xs text-[#777] font-medium">
                โปรแกรมการแข่งขันฟุตบอล พรีเมียร์ลีก ยูฟ่า แชมเปียนส์ลีก และมอเตอร์สปอร์ต
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

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {MOCK_SPORTS_FIXTURES.map((match: SportFixture) => {
            const isLive = match.status === 'live';

            return (
              <div
                key={match.id}
                className="p-4 rounded-2xl bg-[#111] border border-[#222] hover:border-[#FF6321]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1 space-y-2">
                  {/* League & Time Badge */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md font-bold text-[10px] uppercase bg-[#1a1a1a] text-[#bbb] border border-[#2a2a2a]">
                      {match.league}
                    </span>

                    {isLive ? (
                      <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/15 px-2 py-0.5 rounded-md text-[11px] border border-red-500/30">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        LIVE สด • {match.score}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-[#777] font-mono text-[11px]">
                        <Clock className="w-3.5 h-3.5" />
                        {match.date} เวลา {match.matchTime} น.
                      </span>
                    )}

                    {match.isHot && (
                      <span className="flex items-center gap-0.5 text-[10px] font-black uppercase text-[#FF6321] bg-[#FF6321]/15 px-1.5 py-0.5 rounded border border-[#FF6321]/30">
                        <Flame className="w-3 h-3 fill-current" /> แมตช์เดือด
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-white">
                      <span>{match.homeLogo}</span>
                      <span>{match.homeTeam}</span>
                    </div>
                    <span className="text-xs font-black text-[#555] uppercase">VS</span>
                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-white">
                      <span>{match.awayTeam}</span>
                      <span>{match.awayLogo}</span>
                    </div>
                  </div>

                  {/* Channel Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-[#888]">
                    <Radio className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>ถ่ายทอดสดช่อง:</span>
                    <span className="text-[#FF6321] font-bold">{match.channelName}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    onClose();
                    onWatchChannel(match.channelName);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black transition-all shadow uppercase tracking-wider ${
                    isLive
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 active:scale-95'
                      : 'bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 text-white shadow-lg shadow-[#FF6321]/20 active:scale-95'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isLive ? 'รับชมสดตอนนี้' : 'ไปที่ช่องถ่ายทอด'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
