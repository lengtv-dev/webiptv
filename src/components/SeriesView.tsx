import React, { useState, useMemo } from 'react';
import { Tv, Search, SlidersHorizontal } from 'lucide-react';
import { Category, FavoriteItem, MediaType, SeriesItem, XtreamCredentials } from '../types';
import { MediaCard } from './MediaCard';
import { isAdultCategory } from '../services/api';

interface SeriesViewProps {
  categories: Category[];
  series: SeriesItem[];
  activeCategoryId: string;
  onSelectCategory: (catId: string) => void;
  onOpenInfo: (item: any, type: MediaType) => void;
  favorites: FavoriteItem[];
  onToggleFavorite: (e: React.MouseEvent, item: FavoriteItem) => void;
  creds: XtreamCredentials;
  searchQuery: string;
  loading: boolean;
  showAdultContent: boolean;
}

export const SeriesView: React.FC<SeriesViewProps> = ({
  categories,
  series,
  activeCategoryId,
  onSelectCategory,
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

  const filteredSeries = useMemo(() => {
    let list = series.filter((item) => {
      const matchesCat =
        activeCategoryId === 'all' || String(item.category_id) === String(activeCategoryId);
      const matchesSearch =
        !effectiveSearch || item.name.toLowerCase().includes(effectiveSearch.toLowerCase());
      return matchesCat && matchesSearch;
    });

    if (sortBy === 'rating') {
      list = [...list].sort((a, b) => (Number(b.rating) || 0) - (Number(a.rating) || 0));
    } else if (sortBy === 'name') {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name, 'th'));
    }

    return list;
  }, [series, activeCategoryId, effectiveSearch, sortBy]);

  const isSeriesFav = (id: number) => {
    return favorites.some((f) => String(f.id) === String(id) && f.type === 'series');
  };

  return (
    <div className="space-y-5 animate-fadeIn pb-24 md:pb-12">
      {/* Header & Categories */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-2xl bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30 flex items-center justify-center font-black shadow-sm">
              <Tv className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black italic uppercase tracking-tighter text-white">
              ซีรีส์และรายการชุด <span className="text-[#FF6321]">(Series)</span>
            </h2>
            <span className="text-xs font-mono font-bold text-[#888]">
              [{filteredSeries.length} TITLES]
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-[#111] border border-[#222] rounded-full px-3.5 py-1.5 text-xs text-[#bbb]">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF6321]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[#e0e0e0] outline-none cursor-pointer text-xs font-bold"
              >
                <option value="default" className="bg-[#111] text-white">เรียงล่าสุด</option>
                <option value="rating" className="bg-[#111] text-white">คะแนนสูงสุด (IMDb)</option>
                <option value="name" className="bg-[#111] text-white">ชื่อ ก-ฮ / A-Z</option>
              </select>
            </div>

            {/* Quick search */}
            <div className="relative w-full sm:w-60">
              <Search className="w-3.5 h-3.5 text-[#666] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => setLocalSearch(e.target.value)}
                placeholder="ค้นหาชื่อซีรีส์..."
                className="w-full pl-9 pr-4 py-1.5 rounded-full bg-[#111] border border-[#222] text-xs text-[#e0e0e0] placeholder-[#555] outline-none focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321]"
              />
            </div>
          </div>
        </div>

        {/* Categories Horizontal Scroll */}
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

      {/* Series Grid */}
      {loading ? (
        <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#888]">
          <div className="w-10 h-10 border-3 border-[#FF6321] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-bold uppercase tracking-wider">กำลังโหลดรายการซีรีส์จากเซิร์ฟเวอร์...</p>
        </div>
      ) : filteredSeries.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {filteredSeries.map((item) => {
            const categoryObj = categories.find((c) => c.category_id === item.category_id);

            const itemPayload = {
              id: item.series_id,
              seriesId: item.series_id,
              title: item.name,
              poster: item.cover,
              plot: item.plot,
              rating: item.rating,
              year: item.releaseDate || item.release_date,
              categoryName: categoryObj?.category_name,
            };

            return (
              <MediaCard
                key={`series-${item.series_id}`}
                id={item.series_id}
                type="series"
                title={item.name}
                poster={item.cover}
                rating={item.rating}
                year={item.releaseDate || item.release_date}
                categoryName={categoryObj?.category_name}
                isFav={isSeriesFav(item.series_id)}
                onToggleFavorite={onToggleFavorite}
                onPlay={() => onOpenInfo(itemPayload, 'series')}
                onOpenInfo={() => onOpenInfo(itemPayload, 'series')}
                seriesId={item.series_id}
              />
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center p-6 rounded-2xl bg-neutral-900/40 border border-dashed border-neutral-800 space-y-2">
          <Tv className="w-10 h-10 text-neutral-500 mx-auto" />
          <h3 className="text-base font-bold text-neutral-200">ไม่พบซีรีส์ในหมวดหมู่นี้</h3>
          <p className="text-xs text-neutral-400">
            โปรดเลือกหมวดหมู่อื่น หรือค้นหาชื่อซีรีส์ที่ต้องการ
          </p>
        </div>
      )}
    </div>
  );
};
