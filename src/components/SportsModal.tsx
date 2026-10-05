import React from 'react';
import { X, Calendar, Play, Clock, Flame, Radio, Award, ExternalLink } from 'lucide-react';
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
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col bg-neutral-900 border border-neutral-800 rounded-3xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-center justify-between bg-neutral-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-white">
                  ตารางถ่ายทอดสดกีฬา (Live Sports)
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  อัปเดตสด
                </span>
              </div>
              <p className="text-xs text-neutral-400">
                โปรแกรมการแข่งขันฟุตบอล พรีเมียร์ลีก ยูฟ่า แชมเปียนส์ลีก และมอเตอร์สปอร์ต
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

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3">
          {/* Official Sports Schedule Link Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-teal-500/15 to-neutral-900 border border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-lg">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">
                  ตารางถ่ายทอดสดกีฬาทางการ (Live Sports)
                </span>
              </div>
              <p className="text-xs text-neutral-300">
                ดูโปรแกรมถ่ายทอดสดฟุตบอลทุกลีกและกีฬาอื่น ๆ ฉบับเต็มได้ที่{' '}
                <span className="font-semibold text-white underline">https://playid.hstn.me/maintv/tv-ball.html</span>
              </p>
            </div>
            <a
              href="https://playid.hstn.me/maintv/tv-ball.html"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 transition-all shrink-0 active:scale-95"
            >
              <span>เปิดตารางกีฬาเต็มหน้าจอ</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          {MOCK_SPORTS_FIXTURES.map((match: SportFixture) => {
            const isLive = match.status === 'live';

            return (
              <div
                key={match.id}
                className="p-4 rounded-2xl bg-neutral-950/70 border border-neutral-800/80 hover:border-emerald-500/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
              >
                <div className="flex-1 space-y-2">
                  {/* League & Time Badge */}
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2 py-0.5 rounded-md font-semibold bg-neutral-800 text-neutral-300">
                      {match.league}
                    </span>

                    {isLive ? (
                      <span className="flex items-center gap-1 text-red-400 font-bold bg-red-500/10 px-2 py-0.5 rounded-md">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                        LIVE สด • {match.score}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-neutral-400">
                        <Clock className="w-3.5 h-3.5" />
                        {match.date} เวลา {match.matchTime} น.
                      </span>
                    )}

                    {match.isHot && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                        <Flame className="w-3 h-3" /> แมตช์เดือด
                      </span>
                    )}
                  </div>

                  {/* Teams */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-white">
                      <span>{match.homeLogo}</span>
                      <span>{match.homeTeam}</span>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500 uppercase">VS</span>
                    <div className="flex items-center gap-2 font-bold text-sm sm:text-base text-white">
                      <span>{match.awayTeam}</span>
                      <span>{match.awayLogo}</span>
                    </div>
                  </div>

                  {/* Channel Tag */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                    <Radio className="w-3.5 h-3.5 text-emerald-400" />
                    <span>ถ่ายทอดสดช่อง:</span>
                    <span className="text-emerald-400 font-medium">{match.channelName}</span>
                  </div>
                </div>

                {/* Action button */}
                <button
                  onClick={() => {
                    onClose();
                    onWatchChannel(match.channelName);
                  }}
                  className={`flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow ${
                    isLive
                      ? 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 active:scale-95'
                      : 'bg-emerald-500 hover:bg-emerald-400 text-neutral-950 shadow-emerald-500/20 active:scale-95'
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
