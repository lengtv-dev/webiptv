import React, { useState } from 'react';
import { Heart, Radio, Film, Tv, Trash2, Search, Sparkles } from 'lucide-react';
import { FavoriteItem, MediaType, XtreamCredentials } from '../types';
import { MediaCard } from './MediaCard';
import { buildDirectLiveUrl, buildDirectVodUrl } from '../services/api';

interface FavoritesViewProps {
  favorites: FavoriteItem[];
  creds: XtreamCredentials;
  onPlayStream: (streamUrl: string, title: string, extra?: any) => void;
  onOpenInfo: (item: any, type: MediaType) => void;
  onToggleFavorite: (e: React.MouseEvent, item: FavoriteItem) => void;
  onClearAll: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favorites,
  creds,
  onPlayStream,
  onOpenInfo,
  onToggleFavorite,
  onClearAll,
}) => {
  const [filterType, setFilterType] = useState<'all' | MediaType>('all');
  const [localSearch, setLocalSearch] = useState('');

  // Filter items
  const filtered = favorites.filter((item) => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesSearch =
      !localSearch ||
      item.title.toLowerCase().includes(localSearch.toLowerCase()) ||
      (item.categoryName && item.categoryName.toLowerCase().includes(localSearch.toLowerCase()));
    return matchesType && matchesSearch;
  });

  const liveCount = favorites.filter((f) => f.type === 'live').length;
  const vodCount = favorites.filter((f) => f.type === 'vod').length;
  const seriesCount = favorites.filter((f) => f.type === 'series').length;

  return (
    <div className="space-y-6 animate-fadeIn pb-24 md:pb-12">
      {/* Header & Sub-filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1a1a1a]">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-[#D4145A]/15 text-[#D4145A] border border-[#D4145A]/30 flex items-center justify-center shadow-sm">
              <Heart className="w-4 h-4 fill-current" />
            </div>
            <h1 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white">
              รายการโปรดของคุณ <span className="text-[#D4145A]">(Favorites)</span>
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#D4145A] text-white shadow-[0_0_10px_rgba(212,20,90,0.4)]">
              {favorites.length} รายการ
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#777] mt-1 font-medium">
            บันทึกช่องทีวี ภาพยนตร์ และซีรีส์ที่คุณชื่นชอบไว้เปิดดูได้สะดวกรวดเร็ว
          </p>
        </div>

        {/* Clear All Action */}
        {favorites.length > 0 && (
          <button
            onClick={onClearAll}
            className="self-start sm:self-auto flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#111] hover:bg-red-950/60 hover:text-red-400 text-[#888] text-xs font-bold transition-all border border-[#222]"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>ล้างรายการโปรดทั้งหมด</span>
          </button>
        )}
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              filterType === 'all'
                ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                : 'bg-[#111] text-[#888] hover:text-white border border-[#222]'
            }`}
          >
            ทั้งหมด ({favorites.length})
          </button>

          <button
            onClick={() => setFilterType('live')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              filterType === 'live'
                ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                : 'bg-[#111] text-[#888] hover:text-white border border-[#222]'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span>ทีวีสด ({liveCount})</span>
          </button>

          <button
            onClick={() => setFilterType('vod')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              filterType === 'vod'
                ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                : 'bg-[#111] text-[#888] hover:text-white border border-[#222]'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>หนัง VOD ({vodCount})</span>
          </button>

          <button
            onClick={() => setFilterType('series')}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              filterType === 'series'
                ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                : 'bg-[#111] text-[#888] hover:text-white border border-[#222]'
            }`}
          >
            <Tv className="w-3.5 h-3.5" />
            <span>ซีรีส์ ({seriesCount})</span>
          </button>
        </div>

        {/* Search within Favorites */}
        {favorites.length > 4 && (
          <div className="relative w-full sm:w-56">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              placeholder="ค้นหาในรายการโปรด..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 outline-none focus:border-pink-500"
            />
          </div>
        )}
      </div>

      {/* Grid of Favorites */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filtered.map((item) => {
            const isLive = item.type === 'live';
            const streamUrl = isLive
              ? buildDirectLiveUrl(creds, item.streamId || item.id)
              : buildDirectVodUrl(creds, item.streamId || item.id, item.containerExt || 'mp4');

            return (
              <MediaCard
                key={`${item.type}-${item.id}`}
                id={item.id}
                type={item.type}
                title={item.title}
                poster={item.poster}
                rating={item.rating}
                year={item.year}
                categoryName={item.categoryName}
                isFav={true}
                onToggleFavorite={onToggleFavorite}
                onPlay={() => {
                  if (isLive) {
                    onPlayStream(streamUrl, item.title, { type: 'live' });
                  } else {
                    onOpenInfo(item, item.type);
                  }
                }}
                onOpenInfo={() => onOpenInfo(item, item.type)}
                streamId={item.streamId}
                seriesId={item.seriesId}
                containerExt={item.containerExt}
              />
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="py-20 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-pink-500/10 text-pink-400 flex items-center justify-center">
            <Heart className="w-8 h-8 stroke-1" />
          </div>
          <div className="space-y-1 max-w-sm">
            <h3 className="text-base font-bold text-neutral-200">
              {localSearch ? 'ไม่พบรายการที่ตรงกับการค้นหา' : 'ยังไม่มีรายการโปรดในขณะนี้'}
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              {localSearch
                ? 'ลองเปลี่ยนคำค้นหาใหม่อีกครั้ง'
                : 'กดที่ไอคอนรูปหัวใจ ❤️ บนการ์ดเนื้อหา หรือในหน้ารายละเอียดเพื่อบันทึกรายการโปรดของคุณ'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
