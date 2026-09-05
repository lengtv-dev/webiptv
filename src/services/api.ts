import {
  Category,
  LiveStream,
  SeriesDetails,
  SeriesItem,
  VodStream,
  XtreamAuthResponse,
  XtreamCredentials,
  SportFixture,
  VipPackage,
} from '../types';

// Helper to sanitize server URL
export function normalizeServerUrl(url: string): string {
  let clean = (url || '').trim();
  if (!clean.startsWith('http://') && !clean.startsWith('https://')) {
    clean = 'http://' + clean;
  }
  return clean.replace(/\/+$/, '');
}

// Call our backend Xtream proxy to avoid CORS & Mixed Content
async function callXtreamApi<T>(creds: XtreamCredentials, params: Record<string, string>): Promise<T> {
  const query = new URLSearchParams({
    serverUrl: normalizeServerUrl(creds.serverUrl),
    username: creds.username.trim(),
    password: creds.password.trim(),
    ...params,
  });

  const res = await fetch(`/api/xtream?${query.toString()}`);
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new Error(errorBody.error || `Server responded with ${res.status}`);
  }
  return res.json();
}

// 1. Authenticate & Account details
export async function authenticateXtream(creds: XtreamCredentials): Promise<XtreamAuthResponse> {
  const data = await callXtreamApi<XtreamAuthResponse>(creds, {});
  if (!data || !data.user_info || data.user_info.auth !== 1) {
    throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง (Invalid credentials)');
  }
  return data;
}

// 2. Categories
export async function getLiveCategories(creds: XtreamCredentials): Promise<Category[]> {
  try {
    const data = await callXtreamApi<Category[]>(creds, { action: 'get_live_categories' });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to fetch live categories, using fallback', e);
    return getFallbackLiveCategories();
  }
}

export async function getVodCategories(creds: XtreamCredentials): Promise<Category[]> {
  try {
    const data = await callXtreamApi<Category[]>(creds, { action: 'get_vod_categories' });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to fetch VOD categories', e);
    return getFallbackVodCategories();
  }
}

export async function getSeriesCategories(creds: XtreamCredentials): Promise<Category[]> {
  try {
    const data = await callXtreamApi<Category[]>(creds, { action: 'get_series_categories' });
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to fetch series categories', e);
    return getFallbackSeriesCategories();
  }
}

// 3. Streams
export async function getLiveStreams(creds: XtreamCredentials, categoryId?: string): Promise<LiveStream[]> {
  const params: Record<string, string> = { action: 'get_live_streams' };
  if (categoryId && categoryId !== 'all') params.category_id = categoryId;
  try {
    const data = await callXtreamApi<LiveStream[]>(creds, params);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to fetch live streams', e);
    return getFallbackLiveStreams(categoryId);
  }
}

export async function getVodStreams(creds: XtreamCredentials, categoryId?: string): Promise<VodStream[]> {
  const params: Record<string, string> = { action: 'get_vod_streams' };
  if (categoryId && categoryId !== 'all') params.category_id = categoryId;
  try {
    const data = await callXtreamApi<VodStream[]>(creds, params);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to fetch vod streams', e);
    return getFallbackVodStreams(categoryId);
  }
}

export async function getSeriesStreams(creds: XtreamCredentials, categoryId?: string): Promise<SeriesItem[]> {
  const params: Record<string, string> = { action: 'get_series' };
  if (categoryId && categoryId !== 'all') params.category_id = categoryId;
  try {
    const data = await callXtreamApi<SeriesItem[]>(creds, params);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.warn('Failed to fetch series', e);
    return getFallbackSeriesStreams(categoryId);
  }
}

export async function getSeriesInfo(creds: XtreamCredentials, seriesId: number | string): Promise<SeriesDetails> {
  try {
    const data = await callXtreamApi<SeriesDetails>(creds, {
      action: 'get_series_info',
      series_id: String(seriesId),
    });
    return data;
  } catch (e) {
    console.warn('Failed to fetch series info', e);
    return getFallbackSeriesInfo(seriesId);
  }
}

export async function getVodInfo(creds: XtreamCredentials, vodId: number | string): Promise<any> {
  try {
    const data = await callXtreamApi<any>(creds, {
      action: 'get_vod_info',
      vod_id: String(vodId),
    });
    return data;
  } catch (e) {
    return null;
  }
}

// 4. Stream URL Construction
export function buildDirectLiveUrl(creds: XtreamCredentials, streamId: number | string, format: 'm3u8' | 'ts' = 'm3u8'): string {
  const base = normalizeServerUrl(creds.serverUrl);
  return `${base}/live/${encodeURIComponent(creds.username)}/${encodeURIComponent(creds.password)}/${streamId}.${format}`;
}

export function buildDirectVodUrl(creds: XtreamCredentials, streamId: number | string, containerExt = 'mp4'): string {
  const base = normalizeServerUrl(creds.serverUrl);
  return `${base}/movie/${encodeURIComponent(creds.username)}/${encodeURIComponent(creds.password)}/${streamId}.${containerExt || 'mp4'}`;
}

export function buildDirectSeriesUrl(creds: XtreamCredentials, episodeId: number | string, containerExt = 'mp4'): string {
  const base = normalizeServerUrl(creds.serverUrl);
  return `${base}/series/${encodeURIComponent(creds.username)}/${encodeURIComponent(creds.password)}/${episodeId}.${containerExt || 'mp4'}`;
}

export function getProxyStreamUrl(directUrl: string): string {
  return `/api/proxy/stream?url=${encodeURIComponent(directUrl)}`;
}

export function getProxyImageUrl(imgUrl: string | undefined): string {
  if (!imgUrl) return '';
  if (imgUrl.startsWith('data:') || imgUrl.startsWith('/')) return imgUrl;
  // If http, pass through proxy to prevent mixed content
  if (imgUrl.startsWith('http://')) {
    return `/api/proxy/image?url=${encodeURIComponent(imgUrl)}`;
  }
  return imgUrl;
}

// 5. VLC External Player Integration
export function generateVlcLinks(streamUrl: string, title = 'PlayID Stream') {
  // 1. Android Intent
  let androidIntent = '';
  try {
    const urlObj = new URL(streamUrl);
    const hostPort = urlObj.host;
    const pathQuery = urlObj.pathname + urlObj.search;
    androidIntent = `intent://${hostPort}${pathQuery}#Intent;package=org.videolan.vlc;type=video/*;scheme=http;S.title=${encodeURIComponent(title)};end`;
  } catch {
    androidIntent = `intent:${streamUrl}#Intent;package=org.videolan.vlc;type=video/*;scheme=http;end`;
  }

  // 2. iOS VLC URL scheme
  const iosVlc = `vlc://${streamUrl}`;

  // 3. PC/Mac M3U file generation data URL
  const m3uContent = `#EXTM3U\n#EXTINF:-1,${title}\n${streamUrl}`;
  const pcM3uBlob = `data:audio/x-mpegurl;charset=utf-8,${encodeURIComponent(m3uContent)}`;

  return {
    androidIntent,
    iosVlc,
    pcM3uBlob,
    directUrl: streamUrl,
  };
}

export function getM3uPlaylistExportUrl(creds: XtreamCredentials): string {
  const base = normalizeServerUrl(creds.serverUrl);
  return `/api/playlist/m3u?serverUrl=${encodeURIComponent(base)}&username=${encodeURIComponent(creds.username)}&password=${encodeURIComponent(creds.password)}`;
}

// 6. Quality & Badge helpers
export function detectQualityBadge(name: string): string {
  const lower = name.toLowerCase();
  if (lower.includes('4k') || lower.includes('uhd') || lower.includes('2160')) return '4K UHD';
  if (lower.includes('fhd') || lower.includes('1080') || lower.includes('full hd')) return 'Full HD';
  if (lower.includes('hd') || lower.includes('720')) return 'HD';
  if (lower.includes('hevc') || lower.includes('h.265')) return 'HEVC';
  return 'HD';
}

export function isAdultCategory(categoryName: string): boolean {
  const lower = categoryName.toLowerCase();
  return (
    lower.includes('18+') ||
    lower.includes('adult') ||
    lower.includes('xxx') ||
    lower.includes('ผู้ใหญ่') ||
    lower.includes('jav') ||
    lower.includes('nsfw')
  );
}

// 7. Sports Fixtures Mock / Schedule
export const MOCK_SPORTS_FIXTURES: SportFixture[] = [
  {
    id: 'epl-1',
    league: 'Premier League',
    leagueLogo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=100&auto=format&fit=crop&q=60',
    homeTeam: 'Arsenal',
    homeLogo: '🔴',
    awayTeam: 'Chelsea',
    awayLogo: '🔵',
    matchTime: '20:30',
    date: 'วันนี้',
    status: 'live',
    score: '2 - 1 (68\')',
    channelName: 'True Premier Football 1 HD',
    isHot: true,
  },
  {
    id: 'epl-2',
    league: 'Premier League',
    homeTeam: 'Liverpool',
    homeLogo: '🔴',
    awayTeam: 'Manchester City',
    awayLogo: '🩵',
    matchTime: '23:00',
    date: 'วันนี้',
    status: 'upcoming',
    channelName: 'True Premier Football 2 HD',
    isHot: true,
  },
  {
    id: 'ucl-1',
    league: 'UEFA Champions League',
    homeTeam: 'Real Madrid',
    homeLogo: '⚪',
    awayTeam: 'Bayern Munich',
    awayLogo: '🔴',
    matchTime: '02:00',
    date: 'คืนนี้',
    status: 'upcoming',
    channelName: 'beIN Sports 1 HD',
    isHot: true,
  },
  {
    id: 'thai-1',
    league: 'Thai League 1',
    homeTeam: 'Buriram United',
    homeLogo: '⚡',
    awayTeam: 'BG Pathum United',
    awayLogo: '🐇',
    matchTime: '19:00',
    date: 'วันนี้',
    status: 'finished',
    score: '3 - 1',
    channelName: 'True Ball Thai 1 HD',
  },
  {
    id: 'f1-1',
    league: 'Formula 1',
    homeTeam: 'Monaco Grand Prix',
    homeLogo: '🏎️',
    awayTeam: 'Main Race',
    awayLogo: '🏁',
    matchTime: '20:00',
    date: 'พรุ่งนี้',
    status: 'upcoming',
    channelName: 'beIN Sports 3 HD',
  },
];

// 8. VIP Packages
export const VIP_PACKAGES: VipPackage[] = [
  {
    id: 'vip-1m',
    name: 'แพ็กเกจ 1 เดือน',
    price: 150,
    duration: '30 วัน',
    features: ['รับชมได้ทุกช่อง 4K / Full HD', 'ช่องกีฬาครบ EPL, UCL, F1', 'หนังและซีรีส์อัปเดตทุกวัน', 'รองรับ 2 จอพร้อมกัน', 'ความเร็วสูง ไม่กระตุก'],
  },
  {
    id: 'vip-3m',
    name: 'แพ็กเกจ 3 เดือน',
    price: 400,
    duration: '90 วัน',
    popular: true,
    features: ['ประหยัดกว่ารายเดือน 50 บาท', 'รับชมได้ทุกช่อง 4K / Full HD', 'ช่องกีฬาครบ EPL, UCL, F1', 'หนังและซีรีส์อัปเดตทุกวัน', 'รองรับ 3 จอพร้อมกัน', 'ซัพพอร์ต VIP ตลอด 24 ชม.'],
  },
  {
    id: 'vip-6m',
    name: 'แพ็กเกจ 6 เดือน',
    price: 750,
    duration: '180 วัน',
    features: ['ประหยัด 150 บาท', 'รับชมได้ทุกช่อง 4K UHD ลื่นไหล', 'เซิร์ฟเวอร์สตรีมมิ่งสำรอง VIP', 'รองรับ 4 จอพร้อมกัน', 'เข้ากลุ่มแนะนำหนังใหม่พิเศษ'],
  },
  {
    id: 'vip-12m',
    name: 'แพ็กเกจรายปี (12 เดือน)',
    price: 1400,
    duration: '365 วัน',
    features: ['คุ้มที่สุด เฉลี่ยเดือนละ 116 บาท', 'ปลดล็อกเนื้อหาทั้งหมด VIP 4K', 'รองรับ 6 จอพร้อมกันสูงสุด', 'ดาวน์โหลด M3U Plus ไม่จำกัด', 'ประกันอายุการใช้งานเต็มตลอดปี'],
  },
];

// --- Fallbacks for resilient offline testing ---
function getFallbackLiveCategories(): Category[] {
  return [
    { category_id: '1', category_name: 'ไทยดิจิตอล ทีวี' },
    { category_id: '2', category_name: 'กีฬา & ทรูสปอร์ต' },
    { category_id: '3', category_name: 'beIN Sports & ฟุตบอลโลก' },
    { category_id: '4', category_name: 'ภาพยนตร์ & บันเทิง' },
    { category_id: '5', category_name: 'การ์ตูน & แอนิเมชัน' },
    { category_id: '6', category_name: 'ข่าวสาร & สารคดี' },
  ];
}

function getFallbackVodCategories(): Category[] {
  return [
    { category_id: '28', category_name: 'MOV อัพเดทล่าสุด' },
    { category_id: '64', category_name: 'MOV หนังมาใหม่' },
    { category_id: '86', category_name: 'MOV ดูหนัง 4K UHD' },
    { category_id: '34', category_name: 'MOV ดูหนัง 2026' },
  ];
}

function getFallbackSeriesCategories(): Category[] {
  return [
    { category_id: '87', category_name: 'ซีรีส์ On Air' },
    { category_id: '37', category_name: 'ซีรีส์อัพเดทล่าสุด' },
    { category_id: '90', category_name: 'ดูซีรีส์ 2026' },
    { category_id: '27', category_name: 'ดูซีรีส์เกาหลี (พากย์ไทย)' },
  ];
}

function getFallbackLiveStreams(categoryId?: string): LiveStream[] {
  const items: LiveStream[] = [
    {
      num: 1,
      stream_id: 101,
      name: 'ThaiPBS HD (ดิจิทัลทีวี ช่อง 3)',
      stream_icon: 'https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=200&auto=format&fit=crop&q=60',
      category_id: '1',
      stream_type: 'live',
    },
    {
      num: 2,
      stream_id: 102,
      name: 'True Premier Football 1 4K UHD',
      stream_icon: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=200&auto=format&fit=crop&q=60',
      category_id: '2',
      stream_type: 'live',
    },
    {
      num: 3,
      stream_id: 103,
      name: 'beIN Sports 1 Full HD',
      stream_icon: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=200&auto=format&fit=crop&q=60',
      category_id: '3',
      stream_type: 'live',
    },
    {
      num: 4,
      stream_id: 104,
      name: 'Workpoint TV 23 HD',
      stream_icon: 'https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?w=200&auto=format&fit=crop&q=60',
      category_id: '1',
      stream_type: 'live',
    },
  ];
  if (!categoryId || categoryId === 'all') return items;
  return items.filter((i) => i.category_id === categoryId);
}

function getFallbackVodStreams(categoryId?: string): VodStream[] {
  return [
    {
      num: 1,
      stream_id: 201,
      name: 'The Strangers: Chapter 1 (2024)',
      stream_icon: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&auto=format&fit=crop&q=60',
      rating: '7.8',
      rating_5based: 4,
      category_id: '64',
      container_extension: 'mp4',
      stream_type: 'movie',
    },
    {
      num: 2,
      stream_id: 202,
      name: 'Avatar: The Way of Water 4K UHD',
      stream_icon: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=60',
      rating: '8.4',
      rating_5based: 4.5,
      category_id: '86',
      container_extension: 'mp4',
      stream_type: 'movie',
    },
    {
      num: 3,
      stream_id: 203,
      name: 'Dune: Part Two (2024)',
      stream_icon: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=60',
      rating: '8.8',
      rating_5based: 4.5,
      category_id: '64',
      container_extension: 'mp4',
      stream_type: 'movie',
    },
  ];
}

function getFallbackSeriesStreams(categoryId?: string): SeriesItem[] {
  return [
    {
      series_id: 301,
      name: 'กฎหลัก...ห้ามรักเธอ (2026)',
      cover: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=400&auto=format&fit=crop&q=60',
      plot: 'เรื่องราวความสัมพันธ์อันซับซ้อนที่เริ่มต้นจากคำสัญญา แต่กลับกลายเป็นความรักที่ไม่อาจหลีกเลี่ยง',
      category_id: '87',
      rating: '9.2',
    },
    {
      series_id: 302,
      name: 'Queen of Tears (ราชินีแห่งน้ำตา)',
      cover: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400&auto=format&fit=crop&q=60',
      plot: 'วิกฤตความรักของทายาทตระกูลแชโบลและผู้อำนวยการฝ่ายกฎหมายที่ต้องร่วมฝ่าฟันปาฏิหาริย์ไปด้วยกัน',
      category_id: '87',
      rating: '9.5',
    },
  ];
}

function getFallbackSeriesInfo(seriesId: number | string): SeriesDetails {
  return {
    seasons: [
      { id: 1, name: 'Season 1', episode_count: 8, season_number: 1 },
    ],
    info: {
      name: 'กฎหลัก...ห้ามรักเธอ',
      plot: 'เรื่องราวความรักและความลับที่ไม่อาจเปิดเผยในกลุ่มเพื่อนสนิท',
      genre: 'Romantic Drama',
      rating: '9.2',
    },
    episodes: {
      '1': [
        {
          id: 1001,
          episode_num: 1,
          title: 'EP.01 จุดเริ่มต้นที่ไม่คาดคิด',
          container_extension: 'mp4',
          info: { duration: '00:54:20', plot: 'การกลับมาพบกันอีกครั้งหลังจากห่างหายไปหลายปี' },
        },
        {
          id: 1002,
          episode_num: 2,
          title: 'EP.02 สัญญาที่ถูกละเมิด',
          container_extension: 'mp4',
          info: { duration: '00:58:10', plot: 'ความจริงเริ่มปรากฏชัดเจนขึ้นเรื่อยๆ' },
        },
        {
          id: 1003,
          episode_num: 3,
          title: 'EP.03 ความสับสนในใจ',
          container_extension: 'mp4',
          info: { duration: '00:51:30', plot: 'เมื่อความรู้สึกเกินเลยกว่าคำว่าเพื่อน' },
        },
      ],
    },
  };
}
