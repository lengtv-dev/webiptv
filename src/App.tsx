import React, { useState, useEffect, useCallback } from 'react';
import {
  Category,
  FavoriteItem,
  LiveStream,
  MediaType,
  SeriesItem,
  VodStream,
  WatchHistoryItem,
  XtreamAuthResponse,
  XtreamCredentials,
} from './types';
import {
  authenticateXtream,
  getLiveCategories,
  getLiveStreams,
  getSeriesCategories,
  getSeriesStreams,
  getVodCategories,
  getVodStreams,
} from './services/api';
import {
  DEFAULT_CREDENTIALS,
  FAVORITES_UPDATED_EVENT,
  HISTORY_UPDATED_EVENT,
  getFavorites,
  getSettings,
  getStoredCredentials,
  getWatchHistory,
  saveFavorites,
  saveSettings,
  saveStoredCredentials,
  toggleFavorite,
  clearWatchHistory,
  removeHistoryItem,
} from './utils/storage';
import { Navbar } from './components/Navbar';
import { Sidebar, ActiveTab } from './components/Sidebar';
import { LiveTvView } from './components/LiveTvView';
import { VodView } from './components/VodView';
import { SeriesView } from './components/SeriesView';
import { FavoritesView } from './components/FavoritesView';
import { HistoryView } from './components/HistoryView';
import { VideoPlayerModal } from './components/VideoPlayerModal';
import { InfoModal } from './components/InfoModal';
import { LoginModal } from './components/LoginModal';
import { SportsModal } from './components/SportsModal';
import { VipModal } from './components/VipModal';
import { PinModal } from './components/PinModal';

export default function App() {
  // 1. App State
  const [creds, setCreds] = useState<XtreamCredentials>(() => {
    return getStoredCredentials() || DEFAULT_CREDENTIALS;
  });
  const [authData, setAuthData] = useState<XtreamAuthResponse | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('live');
  const [globalSearch, setGlobalSearch] = useState('');
  const [settings, setAppSettings] = useState(() => getSettings());

  // Favorites & Watch History reactive states
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => getFavorites());
  const [watchHistory, setWatchHistory] = useState<WatchHistoryItem[]>(() => getWatchHistory());

  // Data collections
  const [liveCategories, setLiveCategories] = useState<Category[]>([]);
  const [vodCategories, setVodCategories] = useState<Category[]>([]);
  const [seriesCategories, setSeriesCategories] = useState<Category[]>([]);

  const [liveStreams, setLiveStreams] = useState<LiveStream[]>([]);
  const [vodStreams, setVodStreams] = useState<VodStream[]>([]);
  const [seriesStreams, setSeriesStreams] = useState<SeriesItem[]>([]);

  const [activeCategoryId, setActiveCategoryId] = useState<string>('all');
  const [loadingData, setLoadingData] = useState(false);

  // Modals state
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSportsOpen, setIsSportsOpen] = useState(false);
  const [isVipOpen, setIsVipOpen] = useState(false);
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  // Video Player state
  const [playerState, setPlayerState] = useState<{
    isOpen: boolean;
    streamUrl: string;
    title: string;
    extra?: any;
  }>({
    isOpen: false,
    streamUrl: '',
    title: '',
  });

  // Info Modal state
  const [infoModalState, setInfoModalState] = useState<{
    isOpen: boolean;
    type: MediaType;
    item: any;
  }>({
    isOpen: false,
    type: 'vod',
    item: null,
  });

  // Listen to cross-component localStorage events
  useEffect(() => {
    const handleFavUpdated = (e: any) => {
      setFavorites(e.detail || getFavorites());
    };
    const handleHistoryUpdated = (e: any) => {
      setWatchHistory(e.detail || getWatchHistory());
    };

    window.addEventListener(FAVORITES_UPDATED_EVENT, handleFavUpdated);
    window.addEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdated);

    return () => {
      window.removeEventListener(FAVORITES_UPDATED_EVENT, handleFavUpdated);
      window.removeEventListener(HISTORY_UPDATED_EVENT, handleHistoryUpdated);
    };
  }, []);

  // Theme synchronization
  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.theme]);

  // Initial Auth & Data Load
  const initApp = useCallback(async (credentials: XtreamCredentials) => {
    setLoadingData(true);
    try {
      const auth = await authenticateXtream(credentials);
      setAuthData(auth);
      saveStoredCredentials(credentials);

      // Load initial categories
      const [liveCats, vodCats, seriesCats] = await Promise.all([
        getLiveCategories(credentials),
        getVodCategories(credentials),
        getSeriesCategories(credentials),
      ]);

      setLiveCategories(liveCats);
      setVodCategories(vodCats);
      setSeriesCategories(seriesCats);

      // Load initial live streams
      const initialStreams = await getLiveStreams(credentials);
      setLiveStreams(initialStreams);
    } catch (err) {
      console.warn('Authentication or data fetch error:', err);
    } finally {
      setLoadingData(false);
    }
  }, []);

  useEffect(() => {
    initApp(creds);
  }, []);

  // Load content when tab or category changes
  useEffect(() => {
    if (!creds) return;

    const loadTabContent = async () => {
      setLoadingData(true);
      try {
        if (activeTab === 'live') {
          const streams = await getLiveStreams(creds, activeCategoryId);
          setLiveStreams(streams);
        } else if (activeTab === 'vod') {
          const streams = await getVodStreams(creds, activeCategoryId);
          setVodStreams(streams);
        } else if (activeTab === 'series') {
          const series = await getSeriesStreams(creds, activeCategoryId);
          setSeriesStreams(series);
        }
      } catch (err) {
        console.error('Error fetching tab data:', err);
      } finally {
        setLoadingData(false);
      }
    };

    if (activeTab === 'live' || activeTab === 'vod' || activeTab === 'series') {
      loadTabContent();
    }
  }, [activeTab, activeCategoryId, creds]);

  // Handle Tab Switch
  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    setActiveCategoryId('all');
    setGlobalSearch('');
  };

  // Toggle Favorite handler
  const handleToggleFavorite = (e: React.MouseEvent, item: FavoriteItem) => {
    e.stopPropagation();
    toggleFavorite(item);
  };

  // Play Stream handler
  const handlePlayStream = (streamUrl: string, title: string, extra?: any) => {
    setPlayerState({
      isOpen: true,
      streamUrl,
      title,
      extra,
    });
  };

  // Open Info Modal handler
  const handleOpenInfo = (item: any, type: MediaType) => {
    setInfoModalState({
      isOpen: true,
      type,
      item,
    });
  };

  // Open Channel directly from Sports fixtures
  const handleWatchSportsChannel = (channelName: string) => {
    setActiveTab('live');
    setGlobalSearch(channelName);
    // Find matching stream
    const found = liveStreams.find((s) =>
      s.name.toLowerCase().includes(channelName.toLowerCase())
    );
    if (found) {
      handlePlayStream(`/api/proxy/stream?url=...`, found.name, {
        type: 'live',
        streamId: found.stream_id,
        poster: found.stream_icon,
      });
    }
  };

  // Theme Toggle
  const handleToggleTheme = () => {
    const nextTheme = settings.theme === 'dark' ? 'light' : 'dark';
    const updated = saveSettings({ theme: nextTheme });
    setAppSettings(updated);
  };

  // Update Settings
  const handleUpdateSettings = (partial: Partial<typeof settings>) => {
    const updated = saveSettings(partial);
    setAppSettings(updated);
  };

  return (
    <div className={`min-h-screen ${settings.theme === 'dark' ? 'bg-[#050505] text-[#FAFAFA]' : 'bg-neutral-100 text-neutral-900'} flex flex-col font-sans transition-colors duration-300`}>
      {/* Top Navbar */}
      <Navbar
        creds={creds}
        authData={authData}
        searchQuery={globalSearch}
        onSearchChange={setGlobalSearch}
        onOpenSports={() => setIsSportsOpen(true)}
        onOpenVip={() => setIsVipOpen(true)}
        onOpenPinModal={() => setIsPinModalOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        onLogout={() => setIsLoginOpen(true)}
        showAdultContent={settings.showAdultContent}
        theme={settings.theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-[1920px] w-full mx-auto">
        {/* Left Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onSelectTab={handleSelectTab}
          favoritesCount={favorites.length}
          historyCount={watchHistory.length}
          onOpenSports={() => setIsSportsOpen(true)}
          onOpenVip={() => setIsVipOpen(true)}
          authData={authData}
          creds={creds}
        />

        {/* Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-full">
          {activeTab === 'live' && (
            <LiveTvView
              categories={liveCategories}
              streams={liveStreams}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              onPlayStream={handlePlayStream}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              creds={creds}
              searchQuery={globalSearch}
              loading={loadingData}
              showAdultContent={settings.showAdultContent}
            />
          )}

          {activeTab === 'vod' && (
            <VodView
              categories={vodCategories}
              streams={vodStreams}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              onPlayStream={handlePlayStream}
              onOpenInfo={handleOpenInfo}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              creds={creds}
              searchQuery={globalSearch}
              loading={loadingData}
              showAdultContent={settings.showAdultContent}
            />
          )}

          {activeTab === 'series' && (
            <SeriesView
              categories={seriesCategories}
              series={seriesStreams}
              activeCategoryId={activeCategoryId}
              onSelectCategory={setActiveCategoryId}
              onOpenInfo={handleOpenInfo}
              favorites={favorites}
              onToggleFavorite={handleToggleFavorite}
              creds={creds}
              searchQuery={globalSearch}
              loading={loadingData}
              showAdultContent={settings.showAdultContent}
            />
          )}

          {activeTab === 'favorites' && (
            <FavoritesView
              favorites={favorites}
              creds={creds}
              onPlayStream={handlePlayStream}
              onOpenInfo={handleOpenInfo}
              onToggleFavorite={handleToggleFavorite}
              onClearAll={() => saveFavorites([])}
            />
          )}

          {activeTab === 'history' && (
            <HistoryView
              history={watchHistory}
              onPlayStream={handlePlayStream}
              onClearHistory={clearWatchHistory}
              onRemoveItem={removeHistoryItem}
            />
          )}
        </main>
      </div>

      {/* Video Player Modal */}
      <VideoPlayerModal
        isOpen={playerState.isOpen}
        onClose={() => setPlayerState((prev) => ({ ...prev, isOpen: false }))}
        streamUrl={playerState.streamUrl}
        title={playerState.title}
        creds={creds}
        extra={playerState.extra}
        onPlayNextEpisode={(nextEp) => {
          if (!playerState.extra?.seriesId) return;
          const nextUrl = `/api/proxy/stream?url=...`;
          handlePlayStream(nextUrl, `${playerState.title.split('-')[0]} - ${nextEp.title}`, {
            ...playerState.extra,
            episodeId: nextEp.id,
            episodeNum: nextEp.episode_num,
            currentEpisodeIndex: (playerState.extra.currentEpisodeIndex || 0) + 1,
          });
        }}
      />

      {/* Info Modal (Movie / Series Details) */}
      <InfoModal
        isOpen={infoModalState.isOpen}
        onClose={() => setInfoModalState((prev) => ({ ...prev, isOpen: false }))}
        type={infoModalState.type}
        item={infoModalState.item}
        creds={creds}
        onPlayStream={handlePlayStream}
        onFavoritesChanged={() => setFavorites(getFavorites())}
      />

      {/* Glassmorphism Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        defaultCreds={creds}
        onLoginSuccess={(newCreds, newAuth) => {
          setCreds(newCreds);
          setAuthData(newAuth);
          initApp(newCreds);
        }}
      />

      {/* Sports Fixtures Modal */}
      <SportsModal
        isOpen={isSportsOpen}
        onClose={() => setIsSportsOpen(false)}
        onWatchChannel={handleWatchSportsChannel}
      />

      {/* VIP Membership Modal */}
      <VipModal
        isOpen={isVipOpen}
        onClose={() => setIsVipOpen(false)}
        currentUsername={creds?.username}
      />

      {/* 18+ PIN Protection Modal */}
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
      />
    </div>
  );
}
