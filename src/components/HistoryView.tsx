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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              ประวัติการรับชม (Watch History)
            </h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-neutral-800 text-neutral-300 border border-neutral-700">
              {history.length} รายการ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            บันทึกเวลาที่คุณรับชมค้างไว้ สามารถกดรับชมต่อจากจุดเดิมได้ทันที
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="self-start sm:self-auto flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-800/80 hover:bg-red-950 hover:text-red-400 text-neutral-400 text-xs transition-all border border-neutral-700/80"
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
              className="group flex gap-3.5 p-3 rounded-2xl bg-neutral-900/80 border border-neutral-800 hover:border-neutral-700 transition-all shadow-md relative"
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
                className="relative w-28 sm:w-36 aspect-video rounded-xl overflow-hidden bg-neutral-950 flex-shrink-0 cursor-pointer"
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
                <div className="absolute bottom-0 inset-x-0 h-1 bg-neutral-800">
                  <div
                    className="h-full bg-emerald-500"
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between min-w-0">
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-neutral-800 text-neutral-300">
                      {item.type === 'series' ? 'ซีรีส์' : item.type === 'live' ? 'ทีวีสด' : 'หนัง VOD'}
                    </span>
                    <button
                      onClick={() => onRemoveItem(item.id)}
                      className="text-neutral-500 hover:text-red-400 text-xs p-1"
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
                    className="text-sm font-semibold text-white group-hover:text-emerald-400 transition-colors mt-1.5 line-clamp-1 cursor-pointer"
                  >
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-neutral-400 mt-1">
                    <Clock className="w-3.5 h-3.5 text-neutral-500" />
                    <span>
                      {formatSeconds(item.currentTime)} / {formatSeconds(item.duration)} ({item.progressPercent}%)
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-neutral-800/80 mt-2">
                  <span className="text-[11px] text-neutral-500">{formatDate(item.lastWatched)}</span>
                  <button
                    onClick={() =>
                      onPlayStream(item.streamUrl, item.title, {
                        type: item.type,
                        poster: item.poster,
                      })
                    }
                    className="flex items-center gap-1 text-xs font-semibold text-emerald-400 hover:text-emerald-300"
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
