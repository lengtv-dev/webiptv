import React, { useState } from 'react';
import { Radio, Search, Filter, Play, Heart, Star, Tv, RefreshCw } from 'lucide-react';
import { Category, FavoriteItem, LiveStream, XtreamCredentials } from '../types';
import { MediaCard } from './MediaCard';
import { buildDirectLiveUrl, isAdultCategory } from '../services/api';

interface LiveTvViewProps {
  categories: Category[];
  streams: LiveStream[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onPlayStream: (streamUrl: string, title: string, extra?: any) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (e: React.MouseEvent, item: FavoriteItem) => void;
  creds: XtreamCredentials;
  searchQuery: string;
  loading: boolean;
  showAdultContent: boolean;
}

export const LiveTvView: React.FC<LiveTvViewProps> = ({
  categories,
  streams,
  activeCategoryId,
  onSelectCategory,
  onPlayStream,
  favorites,
  onToggleFavorite,
  creds,
  searchQuery,
  loading,
  showAdultContent,
}) => {
  const [channelSearch, setChannelSearch] = useState('');

  // Filter adult categories if hidden
  const visibleCategories = categories.filter(
    (c) => showAdultContent || !isAdultCategory(c.category_name)
  );

  const effectiveSearch = searchQuery || channelSearch;

  const filteredStreams = streams.filter((stream) => {
    const matchesCategory =
      activeCategoryId === 'all' || String(stream.category_id) === String(activeCategoryId);
    const matchesSearch =
      !effectiveSearch ||
      stream.name.toLowerCase().includes(effectiveSearch.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const isStreamFav = (id: number) => {
    return favorites.some((f) => String(f.id) === String(id) && f.type === 'live');
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-24 md:pb-12">
      {/* Category Pills Header */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 shadow-[0_0_10px_#dc2626] animate-pulse" />
            <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white">
              ช่องโทรทัศน์สด <span className="text-[#FF6321]">(Live TV)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-[#888]">
              [{filteredStreams.length} CHANNELS]
            </span>
          </div>

          {/* Quick channel filter search with pill design */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="livetv-search-filter"
              type="text"
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              placeholder="ค้นหาชื่อช่อง เช่น beIN, True, ช่อง 3..."
              className="w-full pl-9 pr-4 py-2 rounded-full bg-[#111] border border-[#222] text-xs text-[#e0e0e0] placeholder-[#555] outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] transition-all"
            />
          </div>
        </div>

        {/* Categories Horizontal Scroll with pill styling */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
              activeCategoryId === 'all'
                ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                : 'bg-[#111] text-[#888] hover:text-white hover:bg-[#1a1a1a] border border-[#222]'
            }`}
          >
            ทุกหมวดหมู่ (ALL)
          </button>

          {visibleCategories.map((cat) => {
            const isActive = activeCategoryId === cat.category_id;
            return (
              <button
                key={cat.category_id}
                onClick={() => onSelectCategory(cat.category_id)}
                className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#FF6321] text-black shadow-[0_0_15px_rgba(255,99,33,0.35)]'
                    : 'bg-[#111] text-[#888] hover:text-white hover:bg-[#1a1a1a] border border-[#222]'
                }`}
              >
                {cat.category_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Streams Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#888]">
          <div className="w-10 h-10 border-3 border-[#FF6321] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-wider">กำลังโหลดช่องรายการสดจากเซิร์ฟเวอร์...</p>
        </div>
      ) : filteredStreams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredStreams.map((stream) => {
            const streamUrl = buildDirectLiveUrl(creds, stream.stream_id);
            const categoryObj = categories.find((c) => c.category_id === stream.category_id);

            return (
              <MediaCard
                key={`live-${stream.stream_id}`}
                id={stream.stream_id}
                type="live"
                title={stream.name}
                poster={stream.stream_icon}
                categoryName={categoryObj?.category_name}
                isFav={isStreamFav(stream.stream_id)}
                onToggleFavorite={onToggleFavorite}
                onPlay={() =>
                  onPlayStream(streamUrl, stream.name, {
                    type: 'live',
                    poster: stream.stream_icon,
                    streamId: stream.stream_id,
                  })
                }
                streamId={stream.stream_id}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center p-6 rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-2">
          <Radio className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-200">ไม่พบช่องสัญญาณในหมวดหมู่นี้</h3>
          <p className="text-xs text-neutral-400">
            โปรดเลือกหมวดหมู่อื่น หรือลองค้นหาด้วยคำใหม่อีกครั้ง
          </p>
        </div>
      )}
    </div>
  );
};
