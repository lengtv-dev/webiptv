import React, { useState, useMemo } from 'react';
import { Film, Search, Star, Sparkles, Filter, SlidersHorizontal } from 'lucide-react';
import { Category, FavoriteItem, MediaType, VodStream, XtreamCredentials } from '../types';
import { MediaCard } from './MediaCard';
import { buildDirectVodUrl, isAdultCategory } from '../services/api';

interface VodViewProps {
  categories: Category[];
  streams: VodStream[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onPlayStream: (streamUrl: string, title: string, extra?: any) => void;
  onOpenInfo: (item: any, type: MediaType) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (e: React.MouseEvent, item: FavoriteItem) => void;
  creds: XtreamCredentials;
  searchQuery: string;
  loading: boolean;
  showAdultContent: boolean;
}

export const VodView: React.FC<VodViewProps> = ({
  categories,
  streams,
  activeCategoryId,
  onSelectCategory,
  onPlayStream,
  onOpenInfo,
  favorites,
  onToggleFavorite,
  creds,
  searchQuery,
  loading,
  showAdultContent,
}) => {
  const [localSearch, setLocalSearch] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'rating' | 'name'>('default');

  const visibleCategories = categories.filter(
    (c) => showAdultContent || !isAdultCategory(c.category_name)
  );

  const effectiveSearch = searchQuery || localSearch;

  const filteredStreams = useMemo(() => {
    let list = streams.filter((stream) => {
      const matchesCat =
        activeCategoryId === 'all' || String(stream.category_id) === String(activeCategoryId);
      const matchesSearch =
        !effectiveSearch ||
        stream.name.toLowerCase().includes(effectiveSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'th'));
    }

    return list;
  }, [streams, activeCategoryId, effectiveSearch, sortBy]);

  const isStreamFav = (id: number) => {
    return favorites.some((f) => String(f.id) === String(id) && f.type === 'vod');
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-24 md:pb-12">
      {/* Category Pills & Sort Header */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Film className="w-4 h-4" />
            </div>
            <h2 className="text-xl font-bold text-white">
              ภาพยนตร์ (VOD Movies)
            </h2>
            <span className="text-xs text-neutral-400 font-medium">
              ({filteredStreams.length} เรื่อง)
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 rounded-xl px-2.5 py-1 text-xs text-neutral-300">
              <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-neutral-200 outline-none cursor-pointer"
              >
                <option value="default" className="bg-neutral-900 text-white">เรียงล่าสุด</option>
                <option value="rating" className="bg-neutral-900 text-white">คะแนนสูงสุด</option>
                <option value="name" className="bg-neutral-900 text-white">ชื่อ ก-ฮ / A-Z</option>
              </select>
            </div>

            {/* Quick search */}
            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="ค้นหาชื่อหนัง..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-200 outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => onSelectCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeCategoryId === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
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
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-bold'
                    : 'bg-neutral-900/80 text-neutral-300 hover:bg-neutral-800 border border-neutral-800'
                }`}
              >
                {cat.category_name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Movie Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-neutral-400">
          <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium">กำลังโหลดรายการภาพยนตร์จากเซิร์ฟเวอร์...</p>
        </div>
      ) : filteredStreams.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredStreams.map((movie) => {
            const streamUrl = buildDirectVodUrl(creds, movie.stream_id, movie.container_extension || 'mp4');
            const categoryObj = categories.find((c) => c.category_id === movie.category_id);

            const itemPayload = {
              id: movie.stream_id,
              streamId: movie.stream_id,
              title: movie.name,
              poster: movie.stream_icon,
              rating: movie.rating,
              categoryName: categoryObj?.category_name,
              containerExt: movie.container_extension,
            };

            return (
              <MediaCard
                key={`vod-${movie.stream_id}`}
                id={movie.stream_id}
                type="vod"
                title={movie.name}
                poster={movie.stream_icon}
                rating={movie.rating}
                categoryName={categoryObj?.category_name}
                isFav={isStreamFav(movie.stream_id)}
                onToggleFavorite={onToggleFavorite}
                onPlay={() =>
                  onPlayStream(streamUrl, movie.name, {
                    type: 'vod',
                    poster: movie.stream_icon,
                    streamId: movie.stream_id,
                  })
                }
                onOpenInfo={() => onOpenInfo(itemPayload, 'vod')}
                streamId={movie.stream_id}
                containerExt={movie.container_extension}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center p-6 rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-2">
          <Film className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-200">ไม่พบภาพยนตร์ในหมวดหมู่นี้</h3>
          <p className="text-xs text-neutral-400">
            โปรดเลือกหมวดหมู่อื่น หรือค้นหาชื่อภาพยนตร์ที่ต้องการ
          </p>
        </div>
      )}
    </div>
  );
};
