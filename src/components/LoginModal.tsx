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
        className="relative w-full max-w-lg bg-neutral-900/90 border border-neutral-700/60 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-2xl text-neutral-100 z-10 space-y-6"
      >
        {/* Header Branding */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-lg shadow-emerald-500/30 mb-2">
            <Tv className="w-8 h-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-neutral-200 to-emerald-400 bg-clip-text text-transparent">
            PlayID IPTV Player
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            ระบบเครื่องเล่น Xtream Codes Web Player & Stream Proxy
          </p>

          {/* Cinematic Movie Backdrop Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700/60 text-xs text-neutral-300 mt-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white">{currentMovie.title}</span>
            <span className="text-neutral-500">•</span>
            <span className="text-emerald-400">{currentMovie.tag}</span>
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
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-emerald-400" />
              <span>ชื่อโปรไฟล์ (Any Name)</span>
            </label>
            <input
              id="login-anyname-input"
              type="text"
              value={anyname}
              onChange={(e) => setAnyname(e.target.value)}
              placeholder="เช่น บ้าน VIP หรือ ห้องนอน"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-500 transition-all outline-none"
            />
          </div>

          {/* Server URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
              <Server className="w-3.5 h-3.5 text-emerald-400" />
              <span>URL เซิร์ฟเวอร์ Xtream Codes (Server URL)</span>
            </label>
            <input
              id="login-server-url-input"
              type="text"
              value={serverUrl}
              onChange={(e) => setServerUrl(e.target.value)}
              required
              placeholder="http://103.114.203.129:8080"
              className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm font-mono text-white placeholder-neutral-500 transition-all outline-none"
            />
          </div>

          {/* Username & Password */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-emerald-400" />
                <span>ชื่อผู้ใช้ (Username)</span>
              </label>
              <input
                id="login-username-input"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="playidtv2535"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-500 transition-all outline-none"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-emerald-400" />
                <span>รหัสผ่าน (Password)</span>
              </label>
              <input
                id="login-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="12345"
                className="w-full px-4 py-2.5 rounded-xl bg-neutral-950/70 border border-neutral-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-sm text-white placeholder-neutral-500 transition-all outline-none"
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-neutral-300 select-none">
              <input
                id="login-remember-checkbox"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-neutral-950 border-neutral-700 text-emerald-500 focus:ring-emerald-500"
              />
              <span>จดจำการเข้าสู่ระบบบนเครื่องนี้ (Remember Me)</span>
            </label>

            <span className="text-[11px] text-emerald-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> บัญชี VIP พร้อมใช้งาน
            </span>
          </div>

          {/* Submit Button */}
          <button
            id="login-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 active:scale-[0.99] text-neutral-950 font-bold text-sm shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-60"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-neutral-950 border-t-transparent rounded-full animate-spin" />
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
        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between text-[11px] text-neutral-500">
          <span>ค่าเริ่มต้น: 103.114.203.129:8080</span>
          <span>Xtream API v2 + Stream Proxy</span>
        </div>
      </div>
    </div>
  );
};
