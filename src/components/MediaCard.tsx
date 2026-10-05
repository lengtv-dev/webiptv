import React, { useState } from 'react';
import { Heart, Play, Film, Tv, Radio, Star, Info } from 'lucide-react';
import { FavoriteItem, MediaType } from '../types';
import { detectQualityBadge, getProxyImageUrl } from '../services/api';

interface MediaCardProps {
  id: string | number;
  type: MediaType;
  title: string;
  poster: string;
  rating?: string | number;
  year?: string;
  categoryName?: string;
  isFav: boolean;
  onToggleFavorite: (e: React.MouseEvent, item: FavoriteItem) => void;
  onPlay: () => void;
  onOpenInfo?: () => void;
  streamId?: number;
  seriesId?: number;
  containerExt?: string;
}

export const MediaCard: React.FC<MediaCardProps> = ({
  id,
  type,
  title,
  poster,
  rating,
  year,
  categoryName,
  isFav,
  onToggleFavorite,
  onPlay,
  onOpenInfo,
  streamId,
  seriesId,
  containerExt,
}) => {
  const [imgError, setImgError] = useState(false);
  const quality = detectQualityBadge(title);
  const cleanPoster = poster ? getProxyImageUrl(poster) : '';

  const fallbackPoster =
    type === 'live'
      ? 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=400&auto=format&fit=crop&q=60'
      : type === 'series'
      ? 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=60'
      : 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=60';

  const favoritePayload: FavoriteItem = {
    id: String(id),
    type,
    title,
    poster: poster || fallbackPoster,
    categoryName,
    addedAt: Date.now(),
    streamId,
    seriesId,
    containerExt,
    rating: rating ? String(rating) : undefined,
    year,
    quality,
  };

  return (
    <div
      id={`media-card-${type}-${id}`}
      className="group relative flex flex-col rounded-xl overflow-hidden bg-neutral-900/80 border border-neutral-800/80 hover:border-neutral-600 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 select-none"
    >
      {/* Thumbnail Aspect Ratio: 16:9 for Live, 2:3 for VOD/Series */}
      <div
        className={`relative w-full overflow-hidden bg-neutral-950 cursor-pointer ${
          type === 'live' ? 'aspect-video' : 'aspect-[2/3]'
        }`}
        onClick={type === 'live' ? onPlay : onOpenInfo || onPlay}
      >
        <img
          src={!imgError && cleanPoster ? cleanPoster : fallbackPoster}
          alt={title}
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-black/40 opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Top Badges: Type & Quality */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {type === 'live' ? (
            <span className="flex items-center gap-1 bg-red-600/90 text-white text-[11px] font-semibold px-2 py-0.5 rounded-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </span>
          ) : type === 'series' ? (
            <span className="flex items-center gap-1 bg-purple-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
              <Tv className="w-3 h-3" /> ซีรีส์
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-blue-600/90 text-white text-[11px] font-medium px-2 py-0.5 rounded-md shadow-sm">
              <Film className="w-3 h-3" /> VOD
            </span>
          )}

          {quality && (
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${
                quality.includes('4K')
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-neutral-800/80 text-neutral-300 border-neutral-700'
              }`}
            >
              {quality}
            </span>
          )}
        </div>

        {/* Quick Heart Button (Top Right Floating) */}
        <button
          id={`quick-fav-btn-${type}-${id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(e, favoritePayload);
          }}
          title={isFav ? 'ลบออกจากรายการโปรด' : 'บันทึกเป็นรายการโปรด'}
          className={`absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
            isFav
              ? 'bg-pink-600 text-white shadow-lg shadow-pink-600/40 scale-105'
              : 'bg-black/60 text-white/80 hover:text-white hover:bg-black/80 hover:scale-110'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Center Play / Detail Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-2.5 opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-[1px]">
          <button
            id={`card-play-action-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="w-11 h-11 rounded-full bg-emerald-500 hover:bg-emerald-400 text-white flex items-center justify-center shadow-xl shadow-emerald-500/30 transform hover:scale-110 transition-all"
            title="เล่นทันที"
          >
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </button>

          {onOpenInfo && type !== 'live' && (
            <button
              id={`card-info-action-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenInfo();
              }}
              className="w-10 h-10 rounded-full bg-neutral-800/90 hover:bg-neutral-700 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
              title="ดูรายละเอียด & ตอนทั้งหมด"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Bar inside image (Rating & Year) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-neutral-300 pointer-events-none">
          {rating && Number(rating) > 0 ? (
            <div className="flex items-center gap-1 font-semibold text-amber-400 bg-black/60 px-1.5 py-0.5 rounded backdrop-blur-sm">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{Number(rating).toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}

          {year && (
            <span className="bg-black/60 px-1.5 py-0.5 rounded font-medium text-neutral-300">
              {year}
            </span>
          )}
        </div>
      </div>

      {/* Title & Info Section */}
      <div
        className="p-3 flex flex-col justify-between flex-1 cursor-pointer bg-neutral-900/60"
        onClick={type === 'live' ? onPlay : onOpenInfo || onPlay}
      >
        <h3
          className="text-sm font-semibold text-neutral-100 group-hover:text-emerald-400 transition-colors line-clamp-2 leading-tight"
          title={title}
        >
          {title}
        </h3>

        {categoryName && (
          <p className="text-[11px] text-neutral-400 mt-1.5 truncate">
            {categoryName}
          </p>
        )}
      </div>
    </div>
  );
};
