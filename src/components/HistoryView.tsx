import React from 'react';
import { History, Play, Trash2, Clock, RotateCcw } from 'lucide-react';
import { WatchHistoryItem } from '../types';
import { getProxyImageUrl } from '../services/api';

interface HistoryViewProps {
  history: WatchHistoryItem[];
  onPlayStream: (streamUrl: string, title: string, extra?: any) => void;
  onClearHistory: () => void;
  onRemoveItem: (id: string) => void;
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  history,
  onPlayStream,
  onClearHistory,
  onRemoveItem,
}) => {
  const formatSeconds = (sec: number) => {
    if (isNaN(sec) || sec <= 0) return '00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatDate = (ts: number) => {
    return new Date(ts).toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a1a1a]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30 flex items-center justify-center shadow-sm">
              <History className="w-4 h-4" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white">
              ประวัติการรับชม <span className="text-[#FF6321]">(Watch History)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1a1a1a] text-[#aaa] border border-[#222]">
              {history.length} รายการ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777] mt-1 font-medium">
            บันทึกเวลาที่คุณรับชมค้างไว้ สามารถกดรับชมต่อจากจุดเดิมได้ทันที
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111] hover:bg-red-950/60 hover:text-red-400 text-[#888] text-xs font-bold transition-all border border-[#222]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างประวัติการดูทั้งหมด</span>
          </button>
        )}
      </div>

      {history.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {history.map((item) => (
            <div
              key={item.id}
              className="group flex gap-3.5 p-3 rounded-2xl bg-[#111] border border-[#222] hover:border-[#FF6321]/50 transition-all shadow-md relative"
            >
              {/* Thumbnail */}
              <div
                onClick={() =>
                  onPlayStream(item.streamUrl, item.title, {
                    type: item.type,
                    poster: item.poster,
                    streamId: item.streamId,
                    seriesId: item.seriesId,
                    episodeId: item.id.replace('series-', ''),
                  })
                }
                className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0 cursor-pointer"
              >
                <img
                  src={getProxyImageUrl(item.poster) || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=60'}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-6 h-6 fill-white text-white" />
                </div>
                {/* Progress bar overlay on bottom of thumbnail */}
                <div className="absolute bottom-0 inset-x-0 h-1.5 bg-[#222]">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF6321] to-[#D4145A]"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-[#1a1a1a] text-[#FF6321] border border-[#2a2a2a]">
                      {item.type === 'series' ? 'ซีรีส์' : item.type === 'live' ? 'ทีวีสด' : 'หนัง VOD'}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-[#555] hover:text-red-400 text-xs p-1"
                      title="ลบออกจากประวัติ"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <h3
                    onClick={() =>
                      onPlayStream(item.streamUrl, item.title, {
                        type: item.type,
                        poster: item.poster,
                      })
                    }
                    className="text-sm font-bold text-white group-hover:text-[#FF6321] transition-colors mt-1.5 line-clamp-1 cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-[#777] mt-1 font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#555]" />
                    <span>
                      {formatSeconds(item.currentTime)} / {formatSeconds(item.duration)} ({item.progressPercent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#1a1a1a] mt-2">
                  <span className="text-[10px] text-[#666] font-mono">{formatDate(item.lastWatched)}</span>
                  <button
                    onClick={() =>
                      onPlayStream(item.streamUrl, item.title, {
                        type: item.type,
                        poster: item.poster,
                      })
                    }
                    className="flex items-center gap-1 text-xs font-bold text-[#FF6321] hover:text-[#ff854f]"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>รับชมต่อ</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center">
            <History className="w-8 h-8" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-neutral-200">ยังไม่มีประวัติการรับชม</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              เมื่อคุณเริ่มรับชมภาพยนตร์ หรือซีรีส์ ระบบจะบันทึกเวลาค้างไว้ให้คุณกลับมาดูต่อได้ทันที
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
