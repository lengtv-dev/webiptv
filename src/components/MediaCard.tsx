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
      className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#111] border border-[#222] hover:border-[#FF6321]/70 transition-all duration-300 hover:shadow-2xl hover:shadow-[#FF6321]/15 hover:-translate-y-1 select-none"
    >
      {/* Thumbnail Aspect Ratio: 16:9 for Live, 2:3 for VOD/Series */}
      <div
        className={`relative w-full overflow-hidden bg-[#0a0a0a] cursor-pointer ${
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
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 opacity-85 group-hover:opacity-95 transition-opacity" />

        {/* Top Badges: Type & Quality */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 z-10">
          {type === 'live' ? (
            <span className="flex items-center gap-1 bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              LIVE
            </span>
          ) : type === 'series' ? (
            <span className="flex items-center gap-1 bg-[#222] border border-[#333] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              <Tv className="w-3 h-3 text-[#FF6321]" /> ซีรีส์
            </span>
          ) : (
            <span className="flex items-center gap-1 bg-[#222] border border-[#333] text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              <Film className="w-3 h-3 text-[#FF6321]" /> VOD
            </span>
          )}

          {quality && (
            <span
              className={`text-[9px] font-black px-1.5 py-0.5 rounded italic uppercase tracking-wider ${
                quality.includes('4K')
                  ? 'bg-[#FF6321] text-black shadow-sm'
                  : 'bg-[#1a1a1a] text-[#ddd] border border-[#333]'
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
              ? 'bg-[#D4145A] text-white shadow-[0_0_12px_rgba(212,20,90,0.5)] scale-105'
              : 'bg-black/60 border border-white/20 text-white/80 hover:text-white hover:bg-black/80 hover:scale-110'
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
        </button>

        {/* Hover Center Play / Detail Buttons */}
        <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 backdrop-blur-[2px]">
          <button
            id={`card-play-action-${id}`}
            onClick={(e) => {
              e.stopPropagation();
              onPlay();
            }}
            className="w-11 h-11 rounded-full bg-white hover:bg-neutral-200 text-black flex items-center justify-center shadow-2xl transform hover:scale-110 transition-all"
            title="เล่นทันที"
          >
            <Play className="w-5 h-5 fill-black ml-0.5" />
          </button>

          {onOpenInfo && type !== 'live' && (
            <button
              id={`card-info-action-${id}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenInfo();
              }}
              className="w-10 h-10 rounded-full bg-[#222]/90 hover:bg-[#333] border border-white/20 text-white flex items-center justify-center shadow-lg transform hover:scale-110 transition-all"
              title="ดูรายละเอียด & ตอนทั้งหมด"
            >
              <Info className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Bottom Bar inside image (Rating & Year) */}
        <div className="absolute bottom-2 left-2.5 right-2.5 flex items-center justify-between text-xs text-[#ddd] pointer-events-none">
          {rating && Number(rating) > 0 ? (
            <div className="flex items-center gap-1 font-bold text-[#FF6321] bg-black/70 px-1.5 py-0.5 rounded backdrop-blur-sm border border-white/10 text-[11px]">
              <Star className="w-3 h-3 fill-[#FF6321]" />
              <span>{Number(rating).toFixed(1)}</span>
            </div>
          ) : (
            <div />
          )}

          {year && (
            <span className="bg-black/70 border border-white/10 px-1.5 py-0.5 rounded font-mono text-[10px] text-[#bbb]">
              {year}
            </span>
          )}
        </div>
      </div>

      {/* Title & Info Section */}
      <div
        className="p-3.5 flex flex-col justify-between flex-1 cursor-pointer bg-[#0d0d0d]"
        onClick={type === 'live' ? onPlay : onOpenInfo || onPlay}
      >
        <h3
          className="text-sm font-bold text-[#f0f0f0] group-hover:text-[#FF6321] transition-colors line-clamp-2 leading-tight"
          title={title}
        >
          {title}
        </h3>

        {categoryName && (
          <p className="text-[10px] font-black uppercase tracking-wider text-[#777] mt-1.5 truncate">
            {categoryName}
          </p>
        )}
      </div>
    </div>
  );
};
