import { FavoriteItem, WatchHistoryItem, AppSettings, XtreamCredentials } from '../types';

export const FAVORITES_KEY = 'playid_favorites_v1';
export const HISTORY_KEY = 'playid_history_v1';
export const SETTINGS_KEY = 'playid_settings_v1';
export const AUTH_KEY = 'playid_auth_v1';

export const FAVORITES_UPDATED_EVENT = 'playid_favorites_updated';
export const HISTORY_UPDATED_EVENT = 'playid_history_updated';

// 1. Favorites Management
export function getFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(FAVORITES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load favorites', e);
    return [];
  }
}

export function saveFavorites(items: FavoriteItem[]) {
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(FAVORITES_UPDATED_EVENT, { detail: items }));
  } catch (e) {
    console.error('Failed to save favorites', e);
  }
}

export function isFavorite(id: string, type: string): boolean {
  const list = getFavorites();
  return list.some((item) => String(item.id) === String(id) && item.type === type);
}

export function toggleFavorite(item: FavoriteItem): boolean {
  const list = getFavorites();
  const index = list.findIndex((i) => String(i.id) === String(item.id) && i.type === item.type);
  if (index >= 0) {
    list.splice(index, 1);
    saveFavorites(list);
    return false; // removed
  } else {
    list.unshift({ ...item, addedAt: Date.now() });
    saveFavorites(list);
    return true; // added
  }
}

export function removeFavorite(id: string, type: string) {
  const list = getFavorites().filter((i) => !(String(i.id) === String(id) && i.type === type));
  saveFavorites(list);
}

// 2. Watch History Management
export function getWatchHistory(): WatchHistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to load history', e);
    return [];
  }
}

export function saveWatchHistoryItem(item: WatchHistoryItem) {
  try {
    const list = getWatchHistory().filter((i) => i.id !== item.id);
    list.unshift({
      ...item,
      lastWatched: Date.now(),
      progressPercent: item.duration > 0 ? Math.min(100, Math.round((item.currentTime / item.duration) * 100)) : 0,
    });
    // Keep max 50 items
    const trimmed = list.slice(0, 50);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
    window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT, { detail: trimmed }));
  } catch (e) {
    console.error('Failed to save history item', e);
  }
}

export function getHistoryItem(id: string): WatchHistoryItem | undefined {
  return getWatchHistory().find((i) => i.id === id);
}

export function removeHistoryItem(id: string) {
  const list = getWatchHistory().filter((i) => i.id !== id);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(list));
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT, { detail: list }));
}

export function clearWatchHistory() {
  localStorage.removeItem(HISTORY_KEY);
  window.dispatchEvent(new CustomEvent(HISTORY_UPDATED_EVENT, { detail: [] }));
}

// 3. Settings Management
export const DEFAULT_SETTINGS: AppSettings = {
  adultPin: '0000',
  showAdultContent: false,
  theme: 'dark',
  autoPlayNext: true,
  useProxyStream: true,
};

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  const current = getSettings();
  const updated = { ...current, ...settings };
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  return updated;
}

// 4. Auth & Remember Me
export const DEFAULT_CREDENTIALS: XtreamCredentials = {
  serverUrl: 'http://103.114.203.129:8080',
  username: 'playidtv2535',
  password: '12345',
  anyname: 'PlayID VIP Home',
  rememberMe: true,
};

export function getStoredCredentials(): XtreamCredentials | null {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
}

export function saveStoredCredentials(creds: XtreamCredentials) {
  if (creds.rememberMe) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(creds));
  } else {
    localStorage.removeItem(AUTH_KEY);
  }
}

export function clearStoredCredentials() {
  localStorage.removeItem(AUTH_KEY);
}
