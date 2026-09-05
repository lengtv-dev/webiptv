import React, { useState, useEffect } from 'react';
import { X, Play, Heart, Star, Calendar, Clock, Film, Tv, Share2, Download, ExternalLink, Check } from 'lucide-react';
import { Episode, FavoriteItem, MediaType, SeriesDetails, XtreamCredentials } from '../types';
import {
  buildDirectSeriesUrl,
  buildDirectVodUrl,
  generateVlcLinks,
  getProxyImageUrl,
  getSeriesInfo,
  getVodInfo,
} from '../services/api';
import { isFavorite, toggleFavorite } from '../utils/storage';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: MediaType;
  item: {
    id: string | number;
    title: string;
    poster: string;
    rating?: string | number;
    year?: string;
    categoryName?: string;
    plot?: string;
    streamId?: number;
    seriesId?: number;
    containerExt?: string;
  } | null;
  creds: XtreamCredentials;
  onPlayStream: (streamUrl: string, title: string, extra?: any) => void;
  onFavoritesChanged?: () => void;
}

export const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  type,
  item,
  creds,
  onPlayStream,
  onFavoritesChanged,
}) => {
  const [isFav, setIsFav] = useState(false);
  const [seriesData, setSeriesData] = useState<SeriesDetails | null>(null);
  const [vodDetails, setVodDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [activeSeason, setActiveSeason] = useState<string>('1');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVlcOptions, setShowVlcOptions] = useState(false);

  useEffect(() => {
    if (!isOpen || !item) return;

    // Check favorite status
    setIsFav(isFavorite(String(item.id), type));

    // Reset details
    setSeriesData(null);
    setVodDetails(null);
    setShowVlcOptions(false);
    setCopiedLink(false);

    if (type === 'series' && (item.seriesId || item.id)) {
      setLoadingDetails(true);
      getSeriesInfo(creds, item.seriesId || item.id)
        .then((data) => {
          setSeriesData(data);
          // Set first available season
          if (data?.episodes) {
            const seasons = Object.keys(data.episodes);
            if (seasons.length > 0) setActiveSeason(seasons[0]);
          }
        })
        .finally(() => setLoadingDetails(false));
    } else if (type === 'vod' && (item.streamId || item.id)) {
      setLoadingDetails(true);
      getVodInfo(creds, item.streamId || item.id)
        .then((data) => setVodDetails(data))
        .finally(() => setLoadingDetails(false));
    }
  }, [isOpen, item, type, creds]);

  if (!isOpen || !item) return null;

  const handleToggleFav = () => {
    const favoritePayload: FavoriteItem = {
      id: String(item.id),
      type,
      title: item.title,
      poster: item.poster,
      categoryName: item.categoryName,
      addedAt: Date.now(),
      streamId: item.streamId,
      seriesId: item.seriesId,
      containerExt: item.containerExt,
      rating: item.rating ? String(item.rating) : undefined,
      year: item.year,
    };
    const newState = toggleFavorite(favoritePayload);
    setIsFav(newState);
    if (onFavoritesChanged) onFavoritesChanged();
  };

  // Direct Stream URL calculation
  const streamUrl =
    type === 'vod'
      ? buildDirectVodUrl(creds, item.streamId || item.id, item.containerExt || 'mp4')
      : '';

  const vlcLinks = streamUrl ? generateVlcLinks(streamUrl, item.title) : null;

  const handleCopyLink = () => {
    if (!streamUrl) return;
    navigator.clipboard.writeText(streamUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const cleanPlot =
    seriesData?.info?.plot ||
    vodDetails?.info?.plot ||
    item.plot ||
    'ไม่มีเรื่องย่อสำหรับเนื้อหานี้ (No synopsis available)';

  const cleanRating =
    seriesData?.info?.rating || vodDetails?.info?.rating || item.rating || '';

  const releaseYear =
    seriesData?.info?.releaseDate?.slice(0, 4) ||
    vodDetails?.info?.releasedate?.slice(0, 4) ||
    item.year ||
    '';

  const duration = vodDetails?.info?.duration || vodDetails?.info?.episode_run_time || '';
  const genre = seriesData?.info?.genre || vodDetails?.info?.genre || '';

  const currentEpisodes: Episode[] =
    seriesData?.episodes && seriesData.episodes[activeSeason]
      ? seriesData.episodes[activeSeason]
      : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div
        id="info-modal-container"
        className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0a0a0a] border border-[#222] rounded-3xl shadow-2xl overflow-hidden text-neutral-100"
      >
        {/* Close Button */}
        <button
          id="info-modal-close-btn"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#1a1a1a]/90 hover:bg-[#252525] text-white flex items-center justify-center backdrop-blur-sm transition-all border border-[#333]"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Poster & Quick Favorite Badge */}
            <div className="relative w-full sm:w-60 flex-shrink-0 aspect-[2/3] rounded-2xl overflow-hidden bg-black border border-[#222] shadow-xl group">
              <img
                src={getProxyImageUrl(item.poster)}
                alt={item.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />

              {/* Quick Favorite Badge (Top-Left of poster in modal) */}
              <button
                id="modal-quick-fav-badge"
                onClick={handleToggleFav}
                className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider backdrop-blur-md transition-all shadow-lg ${
                  isFav
                    ? 'bg-[#D4145A] text-white shadow-[#D4145A]/50'
                    : 'bg-black/70 text-white/90 hover:bg-black/90 hover:text-[#D4145A]'
                }`}
                title="คลิกเพื่อบันทึก/ลบรายการโปรดด่วน"
              >
                <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-current' : ''}`} />
                <span>{isFav ? 'บันทึกแล้ว' : 'บันทึกด่วน'}</span>
              </button>
            </div>

            {/* Main Info */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30">
                    {type === 'series' ? 'ซีรีส์' : 'ภาพยนตร์ VOD'}
                  </span>
                  {item.categoryName && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#111] text-[#888] border border-[#222]">
                      {item.categoryName}
                    </span>
                  )}
                  {genre && (
                    <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-[#111] text-[#777] border border-[#222]">
                      {genre}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-black italic uppercase tracking-tighter text-white mb-3">
                  {item.title}
                </h1>

                {/* Meta details */}
                <div className="flex items-center gap-3 text-sm text-[#aaa] mb-4 flex-wrap">
                  {cleanRating && (
                    <div className="flex items-center gap-1.5 text-[#FF6321] font-black bg-[#FF6321]/15 px-3 py-1 rounded-full text-xs border border-[#FF6321]/30">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{cleanRating} / 10</span>
                    </div>
                  )}

                  {releaseYear && (
                    <div className="flex items-center gap-1 text-[#888] text-xs font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#666]" />
                      <span>ปี {releaseYear}</span>
                    </div>
                  )}

                  {duration && (
                    <div className="flex items-center gap-1 text-[#888] text-xs font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#666]" />
                      <span>{duration}</span>
                    </div>
                  )}
                </div>

                {/* Synopsis / Plot */}
                <div className="space-y-1.5 mb-6">
                  <h4 className="text-[10px] uppercase tracking-wider font-black text-[#666]">
                    เรื่องย่อ / Synopsis
                  </h4>
                  <p className="text-sm text-[#bbb] leading-relaxed max-h-36 overflow-y-auto pr-2 font-medium">
                    {cleanPlot}
                  </p>
                </div>
              </div>

              {/* Action Bar at Bottom of Modal */}
              <div className="pt-4 border-t border-[#1a1a1a] flex flex-wrap items-center gap-3">
                {type === 'vod' && (
                  <button
                    id="modal-play-vod-btn"
                    onClick={() => {
                      onClose();
                      onPlayStream(streamUrl, item.title, {
                        type: 'vod',
                        poster: item.poster,
                        streamId: item.streamId,
                      });
                    }}
                    className="flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-[#FF6321]/20 transition-all active:scale-95"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    <span>เล่นภาพยนตร์ทันที</span>
                  </button>
                )}

                {/* Favorite Button with Pink Highlight & Heart Icon */}
                <button
                  id="modal-action-fav-btn"
                  onClick={handleToggleFav}
                  className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider transition-all border ${
                    isFav
                      ? 'bg-[#D4145A] text-white border-[#D4145A] shadow-lg shadow-[#D4145A]/30'
                      : 'bg-[#111] hover:bg-[#181818] text-white border-[#222]'
                  }`}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'fill-current' : ''}`} />
                  <span>{isFav ? 'บันทึกในรายการโปรดแล้ว' : 'เพิ่มในรายการโปรด'}</span>
                </button>

                {/* External VLC Player Dropdown */}
                {type === 'vod' && vlcLinks && (
                  <div className="relative">
                    <button
                      id="modal-vlc-dropdown-btn"
                      onClick={() => setShowVlcOptions(!showVlcOptions)}
                      className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#161616] hover:bg-[#222] border border-[#333] text-white text-xs font-black uppercase tracking-wider shadow transition-all"
                    >
                      <span>🎬 เปิดใน VLC</span>
                    </button>

                    {showVlcOptions && (
                      <div className="absolute left-0 bottom-full mb-2 w-56 bg-[#0e0e0e] border border-[#252525] rounded-2xl shadow-2xl p-2 z-30 space-y-1 animate-fadeIn">
                        <a
                          href={vlcLinks.androidIntent}
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-[#1a1a1a] text-[#ddd] transition-colors"
                          onClick={() => setShowVlcOptions(false)}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#FF6321]" />
                          <span>Android VLC App (Intent)</span>
                        </a>
                        <a
                          href={vlcLinks.iosVlc}
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-[#1a1a1a] text-[#ddd] transition-colors"
                          onClick={() => setShowVlcOptions(false)}
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-[#FF6321]" />
                          <span>iOS VLC App (Protocol)</span>
                        </a>
                        <a
                          href={vlcLinks.pcM3uBlob}
                          download={`${item.title.replace(/[^\w\s-]/gi, '_')}.m3u`}
                          className="flex items-center gap-2 px-3 py-2 text-xs rounded-xl hover:bg-[#1a1a1a] text-[#ddd] transition-colors"
                          onClick={() => setShowVlcOptions(false)}
                        >
                          <Download className="w-3.5 h-3.5 text-[#FF6321]" />
                          <span>ดาวน์โหลดไฟล์ .m3u (PC/Mac)</span>
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Copy Direct Link */}
                {type === 'vod' && streamUrl && (
                  <button
                    id="modal-copy-link-btn"
                    onClick={handleCopyLink}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-full bg-[#111] hover:bg-[#181818] border border-[#222] text-[#aaa] text-xs font-bold transition-all"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-[#00FF00]" /> : <Share2 className="w-4 h-4" />}
                    <span>{copiedLink ? 'คัดลอกสำเร็จ!' : 'คัดลอกลิงก์'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Series Episodes Browser */}
          {type === 'series' && (
            <div className="pt-6 border-t border-[#1a1a1a] space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <h3 className="text-lg font-black italic uppercase tracking-tighter text-white flex items-center gap-2">
                  <Tv className="w-5 h-5 text-[#FF6321]" />
                  <span>ตอนทั้งหมด (Episodes)</span>
                </h3>

                {/* Seasons Pills */}
                {seriesData?.seasons && seriesData.seasons.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
                    {seriesData.seasons.map((season, index) => {
                      const seasonKey = String(season.season_number || season.id || index + 1);
                      const isActive = activeSeason === seasonKey;
                      return (
                        <button
                          key={seasonKey}
                          onClick={() => setActiveSeason(seasonKey)}
                          className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider whitespace-nowrap transition-all ${
                            isActive
                              ? 'bg-[#FF6321] text-black shadow-md shadow-[#FF6321]/30'
                              : 'bg-[#111] hover:bg-[#1a1a1a] text-[#888] border border-[#222]'
                          }`}
                        >
                          {season.name || `Season ${seasonKey}`}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {loadingDetails ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3 text-[#777]">
                  <div className="w-8 h-8 border-3 border-[#FF6321] border-t-transparent rounded-full animate-spin" />
                  <span className="text-xs font-bold uppercase tracking-wider">กำลังโหลดรายชื่อตอน...</span>
                </div>
              ) : currentEpisodes.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#777] bg-[#111] rounded-2xl border border-[#222]">
                  ไม่พบข้อมูลตอนในซีซันนี้
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
                  {currentEpisodes.map((ep) => {
                    const epStreamUrl = buildDirectSeriesUrl(creds, ep.id, ep.container_extension || 'mp4');
                    const epPoster = ep.info?.movie_image ? getProxyImageUrl(ep.info.movie_image) : item.poster;

                    return (
                      <div
                        key={ep.id}
                        onClick={() => {
                          onClose();
                          onPlayStream(epStreamUrl, `${item.title} - ${ep.title}`, {
                            type: 'series',
                            poster: epPoster,
                            seriesId: item.seriesId,
                            episodeId: ep.id,
                            episodeNum: ep.episode_num,
                            seasonNum: Number(activeSeason),
                            containerExt: ep.container_extension,
                            allEpisodes: currentEpisodes,
                            currentEpisodeIndex: currentEpisodes.findIndex((e) => e.id === ep.id),
                          });
                        }}
                        className="group flex items-center gap-3 p-2.5 rounded-2xl bg-[#111] hover:bg-[#161616] border border-[#222] hover:border-[#FF6321]/50 cursor-pointer transition-all"
                      >
                        <div className="relative w-20 aspect-video rounded-xl overflow-hidden bg-black flex-shrink-0">
                          <img
                            src={epPoster}
                            alt={ep.title}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Play className="w-4 h-4 fill-white text-white" />
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h5 className="text-xs font-bold text-white group-hover:text-[#FF6321] truncate">
                              {ep.title}
                            </h5>
                          </div>
                          {ep.info?.duration && (
                            <span className="text-[10px] font-mono text-[#666] block mt-0.5">
                              {ep.info.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
