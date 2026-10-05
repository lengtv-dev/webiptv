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
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
            <h2 className="text-xl font-bold text-white">
              ช่องโทรทัศน์สด (Live TV)
            </h2>
            <span className="text-xs text-neutral-400 font-medium">
              ({filteredStreams.length} ช่อง)
            </span>
          </div>

          {/* Quick channel filter search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="livetv-search-filter"
              type="text"
              value={channelSearch}
              onChange={(e) => setChannelSearch(e.target.value)}
              placeholder="ค้นหาชื่อช่อง เช่น ช่อง 3, True, beIN..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategoryId === 'all'
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold'
                : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
            }`}
          >
            ทุกหมวดหมู่ (All)
          </button>

          {visibleCategories.map((cat) => {
            const isActive = activeCategoryId === cat.category_id;
            return (
              <button
                key={cat.category_id}
                onClick={() => onSelectCategory(cat.category_id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold'
                    : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
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
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-400">
          <div className="w-10 h-10 border-3 border-red-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">กำลังโหลดช่องรายการสดจากเซิร์ฟเวอร์...</p>
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
