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
  container_extension: string;
  custom_sid?: string | null;
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
  release_date?: string;
  last_modified?: string;
  rating?: string;
  rating_5based?: number;
  backdrop_path?: string[];
  youtube_trailer?: string;
  episode_run_time?: string;
  category_id: string;
}

export interface EpisodeInfo {
  releasedate?: string;
  plot?: string;
  duration_secs?: number;
  duration?: string;
  movie_image?: string;
  rating?: string;
  season?: string | number;
  tmdb_id?: string;
}

export interface Episode {
  id: string | number;
  episode_num: number;
  title: string;
  container_extension: string;
  info?: EpisodeInfo;
  subtitles?: any[];
  custom_sid?: string;
  added?: string;
  season?: number;
}

export interface SeriesDetails {
  seasons: Array<{
    air_date?: string;
    episode_count?: number;
    id?: number;
    name?: string;
    overview?: string;
    season_number?: number;
    cover?: string;
  }>;
  info: {
    name?: string;
    cover?: string;
    plot?: string;
    cast?: string;
    director?: string;
    genre?: string;
    releaseDate?: string;
    rating?: string;
    episode_run_time?: string;
    backdrop_path?: string[];
  };
  episodes: Record<string, Episode[]>;
}

export type MediaType = 'live' | 'vod' | 'series';

export interface FavoriteItem {
  id: string;
  type: MediaType;
  title: string;
  poster: string;
  categoryId?: string;
  categoryName?: string;
  addedAt: number;
  streamId?: number;
  seriesId?: number;
  containerExt?: string;
  rating?: string;
  year?: string;
  quality?: string;
}

export interface WatchHistoryItem {
  id: string;
  type: MediaType;
  title: string;
  poster: string;
  currentTime: number;
  duration: number;
  progressPercent: number;
  lastWatched: number;
  streamUrl: string;
  streamId?: number;
  seriesId?: number;
  seasonNum?: number;
  episodeNum?: number;
  episodeTitle?: string;
  containerExt?: string;
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

