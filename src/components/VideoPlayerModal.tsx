import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  X,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  RotateCcw,
  SkipForward,
  Share2,
  Download,
  ExternalLink,
  Check,
  ShieldCheck,
  Tv,
} from 'lucide-react';
import { generateVlcLinks, getProxyStreamUrl } from '../services/api';
import { getHistoryItem, saveWatchHistoryItem } from '../utils/storage';
import { Episode, XtreamCredentials } from '../types';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  streamUrl: string;
  title: string;
  creds: XtreamCredentials;
  extra?: {
    type?: 'live' | 'vod' | 'series';
    poster?: string;
    streamId?: number;
    seriesId?: number;
    episodeId?: string | number;
    episodeNum?: number;
    seasonNum?: number;
    containerExt?: string;
    allEpisodes?: Episode[];
    currentEpisodeIndex?: number;
  };
  onPlayNextEpisode?: (nextEp: Episode) => void;
}

export const VideoPlayerModal: React.FC<VideoPlayerModalProps> = ({
  isOpen,
  onClose,
  streamUrl,
  title,
  creds,
  extra,
  onPlayNextEpisode,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [useProxy, setUseProxy] = useState(true);
  const [showResumePrompt, setShowResumePrompt] = useState(false);
  const [resumeTimeSeconds, setResumeTimeSeconds] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showVlcMenu, setShowVlcMenu] = useState(false);
  const [showNextCountdown, setShowNextCountdown] = useState<number | null>(null);

  const isLive = extra?.type === 'live' || streamUrl.includes('/live/');

  // Determine active video source URL
  const activeUrl = useProxy ? getProxyStreamUrl(streamUrl) : streamUrl;
  const vlcLinks = generateVlcLinks(streamUrl, title);

  // Check watch history for resume prompt
  useEffect(() => {
    if (!isOpen || isLive) return;
    const historyId = extra?.episodeId ? `series-${extra.episodeId}` : `vod-${extra?.streamId || title}`;
    const previous = getHistoryItem(historyId);
    if (previous && previous.currentTime > 20 && previous.progressPercent < 95) {
      setResumeTimeSeconds(previous.currentTime);
      setShowResumePrompt(true);
    } else {
      setShowResumePrompt(false);
    }
  }, [isOpen, streamUrl, title, isLive, extra]);

  // Player setup with Hls.js
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;
    setLoading(true);
    setErrorMsg(null);

    const video = videoRef.current;
    const isM3U8 = activeUrl.includes('.m3u8') || activeUrl.includes('mpegurl');

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    if (isM3U8 && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
        backBufferLength: 60,
      });
      hlsRef.current = hls;

      hls.loadSource(activeUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setLoading(false);
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        console.warn('Hls error:', data);
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              // Try switching to native/direct or recover
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              setErrorMsg('ไม่สามารถสตรีมช่องนี้ได้ในขณะนี้ กรุณาลองใช้ VLC หรือตรวจสอบการเชื่อมต่อ');
              break;
          }
        }
      });
    } else {
      // Direct MP4 / native HLS (Safari/iOS)
      video.src = activeUrl;
      video.load();
      video.play().catch(() => setIsPlaying(false));
      setLoading(false);
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [isOpen, activeUrl]);

  // Periodic watch progress saver
  useEffect(() => {
    if (!isOpen || isLive) return;
    const interval = setInterval(() => {
      const video = videoRef.current;
      if (video && video.currentTime > 5 && video.duration > 0) {
        const historyId = extra?.episodeId ? `series-${extra.episodeId}` : `vod-${extra?.streamId || title}`;
        saveWatchHistoryItem({
          id: historyId,
          type: extra?.type || 'vod',
          title,
          poster: extra?.poster || '',
          currentTime: video.currentTime,
          duration: video.duration,
          progressPercent: Math.round((video.currentTime / video.duration) * 100),
          lastWatched: Date.now(),
          streamUrl,
          streamId: extra?.streamId,
          seriesId: extra?.seriesId,
          seasonNum: extra?.seasonNum,
          episodeNum: extra?.episodeNum,
          episodeTitle: title,
          containerExt: extra?.containerExt,
        });
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isOpen, isLive, extra, title, streamUrl]);

  // Auto-next episode handling when video reaches end
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !extra?.allEpisodes || extra.currentEpisodeIndex === undefined) return;

    const handleEnded = () => {
      const nextIndex = (extra.currentEpisodeIndex || 0) + 1;
      if (extra.allEpisodes && nextIndex < extra.allEpisodes.length) {
        const nextEp = extra.allEpisodes[nextIndex];
        setShowNextCountdown(5);
        let count = 5;
        const countdownTimer = setInterval(() => {
          count -= 1;
          setShowNextCountdown(count);
          if (count <= 0) {
            clearInterval(countdownTimer);
            setShowNextCountdown(null);
            if (onPlayNextEpisode) onPlayNextEpisode(nextEp);
          }
        }, 1000);
      }
    };

    video.addEventListener('ended', handleEnded);
    return () => video.removeEventListener('ended', handleEnded);
  }, [extra, onPlayNextEpisode]);

  if (!isOpen) return null;

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    videoRef.current.muted = next;
    setIsMuted(next);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setCurrentTime(val);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(streamUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleResume = () => {
    if (videoRef.current && resumeTimeSeconds > 0) {
      videoRef.current.currentTime = resumeTimeSeconds;
      setShowResumePrompt(false);
      videoRef.current.play();
    }
  };

  const handleRestartFromBeginning = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      setShowResumePrompt(false);
      videoRef.current.play();
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '00:00';
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = Math.floor(sec % 60);
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
      <div
        ref={containerRef}
        id="video-player-modal-container"
        className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between border border-[#222] group select-none"
      >
        {/* Top Overlay Bar */}
        <div className="absolute top-0 inset-x-0 z-30 p-4 bg-gradient-to-b from-black/95 via-black/50 to-transparent flex items-center justify-between opacity-95 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-3">
            {isLive ? (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF0055] text-white shadow-lg shadow-[#FF0055]/30 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                LIVE
              </span>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FF6321]/15 text-[#FF6321] border border-[#FF6321]/30">
                <Tv className="w-3 h-3" /> VOD
              </span>
            )}

            <h2 className="text-white text-sm sm:text-base font-bold truncate max-w-md sm:max-w-xl">
              {title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {/* Intelligent Stream Proxy Status Indicator */}
            <button
              onClick={() => setUseProxy(!useProxy)}
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border transition-all ${
                useProxy
                  ? 'bg-[#FF6321]/10 text-[#FF6321] border-[#FF6321]/30'
                  : 'bg-[#111] text-[#777] border-[#222]'
              }`}
              title="สลับโหมด Stream Proxy เพื่อแก้ไขปัญหา HTTPS Mixed Content และ CORS"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{useProxy ? 'Stream Proxy' : 'Direct Link'}</span>
            </button>

            {/* VLC Dropdown */}
            <div className="relative">
              <button
                id="player-vlc-btn"
                onClick={() => setShowVlcMenu(!showVlcMenu)}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#161616] hover:bg-[#222] border border-[#333] text-white text-xs font-black uppercase tracking-wider shadow transition-all"
                title="เปิดในโปรแกรมเล่นภายนอก VLC"
              >
                <span>🎬 VLC</span>
              </button>

              {showVlcMenu && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-[#0e0e0e] border border-[#252525] rounded-2xl shadow-2xl p-2 z-40 space-y-1 text-xs">
                  <a
                    href={vlcLinks.androidIntent}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1a1a1a] text-[#ddd] transition-colors"
                    onClick={() => setShowVlcMenu(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>เปิดด้วย Android VLC App</span>
                  </a>
                  <a
                    href={vlcLinks.iosVlc}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1a1a1a] text-[#ddd] transition-colors"
                    onClick={() => setShowVlcMenu(false)}
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>เปิดด้วย iOS VLC App</span>
                  </a>
                  <a
                    href={vlcLinks.pcM3uBlob}
                    download={`${title.replace(/[^\w\s-]/gi, '_')}.m3u`}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-[#1a1a1a] text-[#ddd] transition-colors"
                    onClick={() => setShowVlcMenu(false)}
                  >
                    <Download className="w-3.5 h-3.5 text-[#FF6321]" />
                    <span>ดาวน์โหลด M3U สำหรับ PC / Mac</span>
                  </a>
                </div>
              )}
            </div>

            {/* Copy Stream Link */}
            <button
              id="player-copy-link-btn"
              onClick={handleCopyLink}
              className="p-1.5 sm:px-3 sm:py-1 rounded-full bg-[#111] hover:bg-[#1a1a1a] border border-[#222] text-[#888] hover:text-white text-xs flex items-center gap-1 font-bold transition-all"
              title="คัดลอกลิงก์สตรีมสด"
            >
              {copiedLink ? <Check className="w-3.5 h-3.5 text-[#00FF00]" /> : <Share2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedLink ? 'คัดลอกแล้ว' : 'คัดลอกลิงก์'}</span>
            </button>

            {/* Close Button */}
            <button
              id="video-player-close-btn"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-white flex items-center justify-center transition-all"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Element */}
        <div className="relative w-full h-full flex items-center justify-center bg-black">
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            onTimeUpdate={() => {
              if (videoRef.current) {
                setCurrentTime(videoRef.current.currentTime);
                setDuration(videoRef.current.duration || 0);
              }
            }}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
          />

          {/* Loading Spinner */}
          {loading && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 backdrop-blur-sm z-20">
              <div className="w-12 h-12 border-4 border-[#FF6321] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-white text-xs font-black uppercase tracking-wider">กำลังเชื่อมต่อสตรีมมิ่งผ่าน Proxy...</p>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-6 text-center z-20 space-y-4">
              <p className="text-red-400 font-bold text-sm max-w-md">{errorMsg}</p>
              <div className="flex items-center gap-3">
                <a
                  href={vlcLinks.pcM3uBlob}
                  download={`${title}.m3u`}
                  className="px-4 py-2 rounded-full bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white text-xs font-black uppercase tracking-wider shadow-lg"
                >
                  เปิดด้วย VLC บนคอมพิวเตอร์
                </a>
                <button
                  onClick={() => {
                    setUseProxy(!useProxy);
                  }}
                  className="px-4 py-2 rounded-full bg-[#161616] hover:bg-[#222] border border-[#333] text-white text-xs font-bold"
                >
                  ลองสลับโหมด {useProxy ? 'Direct' : 'Proxy'}
                </button>
              </div>
            </div>
          )}

          {/* Prompt: Resume Watching from previous timestamp */}
          {showResumePrompt && (
            <div className="absolute bottom-20 inset-x-4 sm:inset-x-auto sm:left-6 z-30 p-4 rounded-2xl bg-[#0a0a0a]/95 border border-[#FF6321]/40 shadow-2xl backdrop-blur-md max-w-sm animate-bounce-short">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2 text-[#FF6321] text-xs font-black uppercase tracking-wider">
                  <RotateCcw className="w-4 h-4" />
                  <span>รับชมต่อจากจุดเดิม?</span>
                </div>
                <button
                  onClick={() => setShowResumePrompt(false)}
                  className="text-[#666] hover:text-white text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-xs text-[#aaa] mb-3">
                คุณได้รับชมค้างไว้ที่นาที {formatSeconds(resumeTimeSeconds)} ต้องการเล่นต่อหรือเริ่มใหม่?
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleResume}
                  className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-all shadow"
                >
                  รับชมต่อ ({formatSeconds(resumeTimeSeconds)})
                </button>
                <button
                  onClick={handleRestartFromBeginning}
                  className="py-2 px-3 rounded-xl bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#aaa] text-xs font-bold transition-all"
                >
                  เริ่มใหม่
                </button>
              </div>
            </div>
          )}

          {/* Auto Next Episode Notification */}
          {showNextCountdown !== null && (
            <div className="absolute inset-0 bg-black/85 flex flex-col items-center justify-center z-30 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#FF6321]/20 border border-[#FF6321] flex items-center justify-center text-2xl font-black text-[#FF6321]">
                {showNextCountdown}
              </div>
              <p className="text-white text-sm font-bold">กำลังจะเล่นตอนถัดไปอัตโนมัติ...</p>
              <button
                onClick={() => setShowNextCountdown(null)}
                className="px-4 py-1.5 rounded-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-[#aaa] text-xs font-bold"
              >
                ยกเลิก
              </button>
            </div>
          )}
        </div>

        {/* Bottom Video Controls */}
        <div className="absolute bottom-0 inset-x-0 z-30 p-3 sm:p-4 bg-gradient-to-t from-black/95 via-black/60 to-transparent opacity-95 group-hover:opacity-100 transition-opacity space-y-2">
          {/* Progress Bar (For VOD/Series) */}
          {!isLive && duration > 0 && (
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={0}
                max={duration}
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#FF6321]"
              />
            </div>
          )}

          <div className="flex items-center justify-between text-white">
            {/* Left Controls: Play, Volume, Timers */}
            <div className="flex items-center gap-3">
              <button
                id="player-toggle-play-btn"
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white flex items-center justify-center hover:opacity-90 transition-all shadow-lg shadow-[#FF6321]/30"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
              </button>

              {/* Volume Slider */}
              <div className="flex items-center gap-1.5 group/vol">
                <button onClick={toggleMute} className="text-[#888] hover:text-white transition-colors">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 sm:w-20 h-1 bg-[#222] rounded-lg appearance-none cursor-pointer accent-[#FF6321]"
                />
              </div>

              {/* Time display */}
              {!isLive && duration > 0 && (
                <span className="text-xs text-[#888] font-mono">
                  {formatSeconds(currentTime)} / {formatSeconds(duration)}
                </span>
              )}

              {isLive && (
                <span className="text-xs text-[#FF0055] font-black uppercase tracking-wider flex items-center gap-1">
                  ● LIVE BROADCAST
                </span>
              )}
            </div>

            {/* Right Controls: Next Ep, Fullscreen */}
            <div className="flex items-center gap-3">
              {extra?.allEpisodes && extra.currentEpisodeIndex !== undefined && extra.currentEpisodeIndex + 1 < extra.allEpisodes.length && (
                <button
                  onClick={() => {
                    const nextEp = extra.allEpisodes![extra.currentEpisodeIndex! + 1];
                    if (onPlayNextEpisode) onPlayNextEpisode(nextEp);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#FF6321] to-[#D4145A] text-white text-xs font-black uppercase tracking-wider shadow transition-all hover:opacity-90"
                  title="เล่นตอนถัดไป"
                >
                  <span>ตอนถัดไป</span>
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                id="player-fullscreen-btn"
                onClick={toggleFullscreen}
                className="p-2 rounded-full bg-[#1a1a1a] hover:bg-[#252525] border border-[#333] text-white transition-all"
                title={isFullscreen ? 'ออกจากเต็มจอ' : 'เล่นแบบเต็มจอ (Fullscreen)'}
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
