export type DeviceView = 'mobile' | 'tablet' | 'desktop';
export type StudioMode = 'builder' | 'preview' | 'code';

export interface AppThemeConfig {
  id: string;
  name: string;
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  surfaceColor: string;
  textColor: string;
  mutedTextColor: string;
  borderColor: string;
  accentGradient: string;
  borderRadius: 'none' | 'rounded-lg' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  fontFamily: 'Plus Jakarta Sans' | 'Kanit' | 'Inter' | 'Poppins';
}

export type BlockType =
  | 'navbar'
  | 'hero'
  | 'stats'
  | 'product-grid'
  | 'card-list'
  | 'data-table'
  | 'interactive-form'
  | 'kanban-board'
  | 'media-player'
  | 'pricing-table'
  | 'review-testimonials'
  | 'order-cart'
  | 'cta-banner'
  | 'faq-accordion'
  | 'footer';

export interface BlockItem {
  id: string;
  title: string;
  description?: string;
  price?: number | string;
  image?: string;
  badge?: string;
  tag?: string;
  icon?: string;
  status?: string;
  actionText?: string;
  rating?: number;
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'select' | 'textarea' | 'checkbox';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  defaultValue?: string;
}

export interface AppBlockComponent {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  badge?: string;
  props: {
    logoText?: string;
    navLinks?: { label: string; targetPage?: string }[];
    heroHeadline?: string;
    heroSubheadline?: string;
    heroCtaText?: string;
    heroCtaSecondary?: string;
    heroImageUrl?: string;
    items?: BlockItem[];
    stats?: { label: string; value: string; change?: string; isPositive?: boolean; icon?: string }[];
    formFields?: FormField[];
    submitButtonText?: string;
    formSuccessMessage?: string;
    tableColumns?: string[];
    tableRows?: Record<string, string | number>[];
    mediaUrl?: string;
    mediaType?: 'video' | 'audio' | 'stream';
    mediaTitle?: string;
    kanbanColumns?: { id: string; title: string; items: { id: string; title: string; tag: string }[] }[];
    pricingTiers?: {
      id: string;
      name: string;
      price: string;
      period: string;
      popular?: boolean;
      features: string[];
      buttonText: string;
    }[];
    faqs?: { question: string; answer: string }[];
    cartItems?: { id: string; name: string; price: number; quantity: number }[];
    footerText?: string;
    footerLinks?: { label: string; url: string }[];
  };
  style?: {
    customBg?: string;
    customTextColor?: string;
    padding?: 'small' | 'medium' | 'large';
    border?: boolean;
    rounded?: boolean;
  };
}

export interface AppPage {
  id: string;
  name: string;
  slug: string;
  icon: string;
  components: AppBlockComponent[];
}

export interface AppProject {
  id: string;
  name: string;
  description: string;
  category: string;
  theme: AppThemeConfig;
  pages: AppPage[];
  activePageId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AppTemplate {
  id: string;
  name: string;
  nameTh: string;
  descriptionTh: string;
  category: string;
  icon: string;
  badge: string;
  project: AppProject;
}

export interface AiPromptRequest {
  prompt: string;
  appType?: string;
  themePreset?: string;
}

// ==========================================
// Compatibility Types for existing IPTV modules
// ==========================================

export interface XtreamCredentials {
  serverUrl: string;
  username: string;
  password: string;
  anyname?: string;
  rememberMe?: boolean;
}

export interface UserInfo {
  username: string;
  password?: string;
  message?: string;
  auth: number;
  status: string;
  exp_date: string;
  is_trial: string;
  active_cons: string;
  created_at?: string;
  max_connections: string;
  allowed_output_formats?: string[];
}

export interface ServerInfo {
  url: string;
  port: string;
  https_port?: string;
  server_protocol: string;
  rtmp_port?: string;
  timezone: string;
  timestamp_now?: number;
  time_now?: string;
}

export interface XtreamAuthResponse {
  user_info: UserInfo;
  server_info: ServerInfo;
}

export interface Category {
  category_id: string;
  category_name: string;
  parent_id?: number;
}

export interface LiveStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  epg_channel_id?: string;
  added?: string;
  category_id: string;
  custom_sid?: string;
  tv_archive?: number;
  direct_source?: string;
  tv_archive_duration?: number;
}

export interface VodStream {
  num: number;
  name: string;
  stream_type: string;
  stream_id: number;
  stream_icon: string;
  rating?: string;
  rating_5based?: number;
  added?: string;
  category_id: string;
  container_extension?: string;
  custom_sid?: string;
  direct_source?: string;
}

export interface SeriesItem {
  num?: number;
  name: string;
  series_id: number;
  cover: string;
  plot?: string;
  cast?: string;
  director?: string;
  genre?: string;
  releaseDate?: string;
  last_modified?: string;
  rating?: string;
  rating_5based?: number;
  backdrop_path?: string[];
  youtube_trailer?: string;
  episode_run_time?: string;
  category_id: string;
}

export interface Episode {
  id: string | number;
  episode_num: number;
  title: string;
  container_extension: string;
  info?: {
    duration?: string;
    bitrate?: number;
    plot?: string;
    releasedate?: string;
    movie_image?: string;
  };
  custom_sid?: string;
  added?: string;
  season?: number;
  direct_source?: string;
}

export interface Season {
  id?: string | number;
  season_num?: number;
  season_number?: number;
  name?: string;
  episode_count?: number;
  episodes?: Episode[];
}

export interface SeriesDetails {
  seasons: Season[];
  info: any;
  episodes: Record<string, Episode[]>;
}

export type MediaType = 'live' | 'vod' | 'series';

export interface FavoriteItem {
  id: string;
  type: MediaType;
  name?: string;
  title?: string;
  streamId: number | string;
  seriesId?: number | string;
  icon?: string;
  poster?: string;
  categoryId?: string;
  categoryName?: string;
  rating?: string | number;
  year?: string | number;
  quality?: string;
  addedAt?: number;
  containerExtension?: string;
  containerExt?: string;
}

export interface WatchHistoryItem {
  id: string;
  type: MediaType;
  name?: string;
  title?: string;
  streamId: number | string;
  seriesId?: number | string;
  seasonNum?: number;
  episodeNum?: number;
  icon?: string;
  poster?: string;
  containerExt?: string;
  lastPositionSeconds?: number;
  durationSeconds?: number;
  watchedAt?: number;
  lastWatched?: number;
  currentTime?: number;
  duration?: number;
  progressPercent?: number;
  streamUrl: string;
  episodeTitle?: string;
}

export interface SportFixture {
  id: string;
  league: string;
  leagueLogo?: string;
  homeTeam: string;
  homeLogo: string;
  awayTeam: string;
  awayLogo: string;
  matchTime: string;
  date: string;
  status: 'live' | 'upcoming' | 'finished';
  score?: string;
  channelName: string;
  channelStreamId?: number;
  isHot?: boolean;
}

export interface AppSettings {
  adultPin: string;
  showAdultContent: boolean;
  theme: 'dark' | 'light';
  autoPlayNext: boolean;
  useProxyStream: boolean;
}

export interface VipPackage {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
  popular?: boolean;
}

export type ActiveTab = 'live' | 'vod' | 'series' | 'favorites' | 'history';

