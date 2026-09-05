import React, { useState } from 'react';
import { Tv, Server, User, Lock, Tag, Check, AlertCircle, ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';
import { XtreamCredentials } from '../types';
import { authenticateXtream } from '../services/api';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (creds: XtreamCredentials, authData: any) => void;
  defaultCreds: XtreamCredentials;
}

const BACKDROP_MOVIES = [
  {
    title: 'Dune: Part Two (2024)',
    rating: '8.8',
    backdrop: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=1600&auto=format&fit=crop&q=80',
    tag: 'Sci-Fi / Adventure',
  },
  {
    title: 'Avatar: The Way of Water (2023)',
    rating: '8.4',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
    tag: '4K Ultra HD',
  },
  {
    title: 'Oppenheimer (2023)',
    rating: '8.9',
    backdrop: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1600&auto=format&fit=crop&q=80',
    tag: 'Drama / History',
  },
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  defaultCreds,
}) => {
  const [serverUrl, setServerUrl] = useState(defaultCreds.serverUrl);
  const [username, setUsername] = useState(defaultCreds.username);
  const [password, setPassword] = useState(defaultCreds.password);
  const [anyname, setAnyname] = useState(defaultCreds.anyname || 'PlayID Home VIP');
  const [rememberMe, setRememberMe] = useState(defaultCreds.rememberMe ?? true);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMovieIndex, setActiveMovieIndex] = useState(0);

  if (!isOpen) return null;

  const currentMovie = BACKDROP_MOVIES[activeMovieIndex];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const creds: XtreamCredentials = {
      serverUrl: serverUrl.trim(),
      username: username.trim(),
      password: password.trim(),
      anyname: anyname.trim(),
      rememberMe,
    };

    try {
      const authData = await authenticateXtream(creds);
      onLoginSuccess(creds, authData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาตรวจสอบข้อมูลอีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-xl animate-fadeIn">
      {/* Background Cinematic Visual */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
        <img
          src={currentMovie.backdrop}
          alt="Backdrop"
          className="w-full h-full object-cover filter blur-sm scale-105 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
      </div>

      <div
        id="login-glass-card"
        className="relative w-full max-w-lg bg-[#0a0a0a]/95 border border-[#222] rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-neutral-100 z-10 space-y-6"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#FF6321] to-[#D4145A] text-white shadow-lg shadow-[#FF6321]/30 mb-2">
            <Tv className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black italic tracking-tighter text-white">
            PLAY<span className="text-[#FF6321]">ID</span> IPTV PLAYER
          </h1>
          <p className="text-xs sm:text-sm text-[#777] font-medium">
            ระบบเครื่องเล่น Xtream Codes Web Player & Stream Proxy
          </p>

          {/* Cinematic Movie Backdrop Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#141414] border border-[#222] text-xs text-[#bbb] mt-2">
            <Star className="w-3.5 h-3.5 fill-[#FF6321] text-[#FF6321]" />
            <span className="font-bold text-white">{currentMovie.title}</span>
            <span className="text-[#444]">•</span>
            <span className="text-[#FF6321] font-bold">{currentMovie.tag}</span>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-950/70 border border-red-800/80 text-red-300 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Anyname */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#888] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Tag className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>ชื่อโปรไฟล์ (Any Name)</span>
            </label>
            <input
              id="login-anyname-input"
              type="text"
              value={anyname}
              onChange={(e) => setAnyname(e.target.value)}
              placeholder="เช่น บ้าน VIP หรือ ห้องนอน"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-[#222] focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] text-sm text-white placeholder-[#555] transition-all outline-none font-medium"
            />
          </div>

          {/* Server URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#888] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
              <Server className="w-3.5 h-3.5 text-[#FF6321]" />
              <span>URL เซิร์ฟเวอร์ Xtream Codes (Server URL)</span>
            </label>
            <input
              id="login-server-url-input"
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
              placeholder="http://103.114.203.129:8080"
              className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-[#222] focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] text-sm font-mono text-[#00FF00] placeholder-[#555] transition-all outline-none"
            />
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#888] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <User className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>ชื่อผู้ใช้ (Username)</span>
              </label>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="playidtv2535"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-[#222] focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] text-sm text-white placeholder-[#555] transition-all outline-none font-medium"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#888] flex items-center gap-1.5 uppercase tracking-wider text-[10px]">
                <Lock className="w-3.5 h-3.5 text-[#FF6321]" />
                <span>รหัสผ่าน (Password)</span>
              </label>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="12345"
                className="w-full px-4 py-2.5 rounded-xl bg-[#111] border border-[#222] focus:border-[#FF6321] focus:ring-1 focus:ring-[#FF6321] text-sm text-white placeholder-[#555] transition-all outline-none font-medium"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#aaa] select-none font-medium">
              <input
                id="login-remember-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-black border-[#333] text-[#FF6321] focus:ring-[#FF6321]"
              />
              <span>จดจำการเข้าสู่ระบบบนเครื่องนี้</span>
            </label>

            <span className="text-[11px] text-[#00FF00] font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> บัญชี VIP พร้อมใช้งาน
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FF6321] to-[#D4145A] hover:opacity-90 active:scale-[0.99] text-white font-black text-sm shadow-xl shadow-[#FF6321]/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60 uppercase tracking-wider"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>กำลังตรวจสอบสิทธิ์บัญชี...</span>
              </>
            ) : (
              <>
                <span>เข้าสู่ระบบและเริ่มรับชมทันที</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info note */}
        <div className="pt-2 border-t border-[#1a1a1a] flex items-center justify-between text-[10px] font-mono text-[#666]">
          <span>ค่าเริ่มต้น: 103.114.203.129:8080</span>
          <span>Xtream API v2 + Stream Proxy</span>
        </div>
      </div>
    </div>
  );
};
