import React, { useState, useEffect, useCallback } from 'react';
import {
  DEMO_TEST_PLAYLIST,
  INITIAL_CHANNELS,
  INITIAL_VOD_MOVIES,
  INITIAL_VOD_SERIES,
  INITIAL_RADIO,
  INITIAL_EPG,
  INITIAL_RECORDINGS
} from './data/defaultChannels';
import {
  Channel,
  VodMovie,
  VodSeries,
  RadioStation,
  EpgProgram,
  Recording,
  Playlist,
  UserProfile,
  AppSettings,
  ThemeType
} from './types/iptv';
import { TvNavigationHeader, NavigationTab } from './components/TvNavigationHeader';
import { HomeScreenView } from './components/HomeScreenView';
import { LiveTvView } from './components/LiveTvView';
import { VodView } from './components/VodView';
import { EpgGridGuide } from './components/EpgGridGuide';
import { RecordingsView } from './components/RecordingsView';
import { ExoPlayerModal } from './components/ExoPlayerModal';
import { ElifAiAssistantModal } from './components/ElifAiAssistantModal';
import { UniversalSearchModal } from './components/UniversalSearchModal';
import { PlaylistManagerModal } from './components/PlaylistManagerModal';
import { SettingsModal } from './components/SettingsModal';
import { LegalOnboardingModal } from './components/LegalOnboardingModal';
import { TvRemoteSimulator } from './components/TvRemoteSimulator';
import { AndroidCodebaseViewer } from './components/AndroidCodebaseViewer';
import { ApkDownloadGuideModal } from './components/ApkDownloadGuideModal';
import { ShieldCheck, Info, Sparkles } from 'lucide-react';

export default function App() {
  // Playlists & Content state
  const [playlists, setPlaylists] = useState<Playlist[]>([DEMO_TEST_PLAYLIST]);
  const [activePlaylistId, setActivePlaylistId] = useState<string>(DEMO_TEST_PLAYLIST.id);
  const [channels, setChannels] = useState<Channel[]>(INITIAL_CHANNELS);
  const [movies, setMovies] = useState<VodMovie[]>(INITIAL_VOD_MOVIES);
  const [series, setSeries] = useState<VodSeries[]>(INITIAL_VOD_SERIES);
  const [radioStations, setRadioStations] = useState<RadioStation[]>(INITIAL_RADIO);
  const [epgList, setEpgList] = useState<EpgProgram[]>(INITIAL_EPG);
  const [recordings, setRecordings] = useState<Recording[]>(INITIAL_RECORDINGS);

  // User Profiles
  const [profiles] = useState<UserProfile[]>([
    { id: 'prof-1', name: 'Master TV', avatar: 'M', isKids: false, isPinProtected: false },
    { id: 'prof-2', name: 'Kids Zone', avatar: 'K', isKids: true, isPinProtected: true, pin: '1234' }
  ]);
  const [activeProfile, setActiveProfile] = useState<UserProfile>(profiles[0]);

  // Navigation tab
  const [currentTab, setCurrentTab] = useState<NavigationTab>('home');

  // App Settings
  const [settings, setSettings] = useState<AppSettings>({
    theme: 'elifai-premium',
    bufferTuning: 'large',
    hardwareDecoding: true,
    audioPassthrough: true,
    autoEpgRefreshHours: 12,
    manualEpgUrl: '',
    parentalPin: '0000',
    adultLocked: true,
    safeMode: false,
    storageLocation: 'internal',
    aiProviderPreference: 'openrouter',
    lastChannelReturn: true,
    pictureInPictureEnabled: true
  });

  // Player state
  const [currentStream, setCurrentStream] = useState<{
    type: 'channel' | 'movie' | 'series' | 'radio';
    item: any;
  } | null>(null);
  const [lastChannel, setLastChannel] = useState<Channel | null>(null);

  // Modals
  const [showLegalNotice, setShowLegalNotice] = useState<boolean>(() => {
    return !localStorage.getItem('elifai_legal_accepted');
  });
  const [showSearchModal, setShowSearchModal] = useState<boolean>(false);
  const [showVoiceSearch, setShowVoiceSearch] = useState<boolean>(false);
  const [showAssistantModal, setShowAssistantModal] = useState<boolean>(false);
  const [showPlaylistModal, setShowPlaylistModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [showRemote, setShowRemote] = useState<boolean>(true);
  const [showApkGuideModal, setShowApkGuideModal] = useState<boolean>(false);

  // Assistant initial prompt trigger
  const [assistantInitialPrompt, setAssistantInitialPrompt] = useState<string>('');

  // Legal Acceptance handler
  const handleAcceptLegal = () => {
    localStorage.setItem('elifai_legal_accepted', 'true');
    setShowLegalNotice(false);
  };

  // Playback handlers
  const handlePlayChannel = (channel: Channel) => {
    if (currentStream?.type === 'channel' && currentStream.item.id !== channel.id) {
      setLastChannel(currentStream.item);
    }
    setCurrentStream({ type: 'channel', item: channel });
  };

  const handlePlayMovie = (movie: VodMovie) => {
    setCurrentStream({ type: 'movie', item: movie });
  };

  const handlePlaySeries = (s: VodSeries) => {
    const firstEp = s.seasons[0]?.episodes[0];
    if (firstEp) {
      setCurrentStream({
        type: 'series',
        item: {
          ...firstEp,
          title: `${s.title} - S1:E1 ${firstEp.title}`
        }
      });
    }
  };

  const handlePlayRadio = (rad: RadioStation) => {
    setCurrentStream({ type: 'radio', item: rad });
  };

  const handleToggleFavorite = (id: string, type: string) => {
    if (type === 'channel') {
      setChannels(prev =>
        prev.map(c => (c.id === id ? { ...c, isFavorite: !c.isFavorite } : c))
      );
    } else if (type === 'movie') {
      setMovies(prev =>
        prev.map(m => (m.id === id ? { ...m, isFavorite: !m.isFavorite } : m))
      );
    } else if (type === 'series') {
      setSeries(prev =>
        prev.map(s => (s.id === id ? { ...s, isFavorite: !s.isFavorite } : s))
      );
    }
  };

  const handleScheduleRecording = (program: EpgProgram, channel: Channel) => {
    const newRec: Recording = {
      id: `rec-${Date.now()}`,
      title: program.title,
      channelName: channel.name,
      channelLogo: channel.logo,
      streamUrl: channel.streamUrl,
      startTime: `Today, ${program.startTime}`,
      durationMinutes: 60,
      storageType: settings.storageLocation,
      filePath:
        settings.storageLocation === 'usb'
          ? `/mnt/media_rw/USB_DRIVE_A1/ElifAI_IPTV/rec_${Date.now()}.ts`
          : `/storage/emulated/0/ElifAI_IPTV/Recordings/rec_${Date.now()}.ts`,
      status: 'scheduled'
    };
    setRecordings(prev => [newRec, ...prev]);
  };

  const handleRecordActiveChannel = (channel: Channel) => {
    const newRec: Recording = {
      id: `rec-${Date.now()}`,
      title: `Live Capture: ${channel.name}`,
      channelName: channel.name,
      channelLogo: channel.logo,
      streamUrl: channel.streamUrl,
      startTime: 'Just now',
      durationMinutes: 30,
      storageType: settings.storageLocation,
      filePath:
        settings.storageLocation === 'usb'
          ? `/mnt/media_rw/USB_DRIVE_A1/ElifAI_IPTV/live_${Date.now()}.ts`
          : `/storage/emulated/0/ElifAI_IPTV/Recordings/live_${Date.now()}.ts`,
      status: 'completed',
      fileSizeBytes: 840000000
    };
    setRecordings(prev => [newRec, ...prev]);
  };

  const handleDeleteRecording = (id: string) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
  };

  // Playlist Management
  const handleAddPlaylist = (
    newPlaylist: Playlist,
    newChannels?: Channel[],
    newMovies?: VodMovie[]
  ) => {
    setPlaylists(prev => [...prev, newPlaylist]);
    setActivePlaylistId(newPlaylist.id);
    if (newChannels && newChannels.length > 0) {
      setChannels(prev => [...newChannels, ...prev]);
    }
    if (newMovies && newMovies.length > 0) {
      setMovies(prev => [...newMovies, ...prev]);
    }
  };

  const handleDeletePlaylist = (id: string) => {
    setPlaylists(prev => prev.filter(p => p.id !== id));
    if (activePlaylistId === id && playlists.length > 1) {
      const next = playlists.find(p => p.id !== id);
      if (next) setActivePlaylistId(next.id);
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      app: 'ElifAI IPTV',
      version: '2.5.0-production',
      exportDate: new Date().toISOString(),
      settings,
      playlists,
      favorites: {
        channels: channels.filter(c => c.isFavorite).map(c => c.id),
        movies: movies.filter(m => m.isFavorite).map(m => m.id)
      }
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupData, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `ElifAI_IPTV_Backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(dlAnchor);
    dlAnchor.click();
    dlAnchor.remove();
  };

  const handleImportBackup = (jsonText: string) => {
    try {
      const data = JSON.parse(jsonText);
      if (data.settings) setSettings(data.settings);
      if (data.playlists && Array.isArray(data.playlists)) setPlaylists(data.playlists);
      alert('ElifAI IPTV backup restored successfully!');
    } catch {
      alert('Invalid backup file format.');
    }
  };

  // D-Pad and Keyboard navigation shortcuts
  const handleRemoteKey = useCallback((key: string) => {
    switch (key) {
      case 'home':
        setCurrentTab('home');
        if (currentStream) setCurrentStream(null);
        break;
      case 'back':
        if (currentStream) setCurrentStream(null);
        else if (showAssistantModal) setShowAssistantModal(false);
        else if (showSearchModal) setShowSearchModal(false);
        else if (showSettingsModal) setShowSettingsModal(false);
        else if (showPlaylistModal) setShowPlaylistModal(false);
        break;
      case 'menu':
        setShowSettingsModal(true);
        break;
      case 'mic':
        setShowAssistantModal(true);
        break;
      case 'info':
        setShowLegalNotice(true);
        break;
      case 'ch_up':
        if (channels.length > 0) {
          const currentIndex = channels.findIndex(c => c.id === currentStream?.item?.id);
          const nextIndex = (currentIndex + 1) % channels.length;
          handlePlayChannel(channels[nextIndex]);
        }
        break;
      case 'ch_down':
        if (channels.length > 0) {
          const currentIndex = channels.findIndex(c => c.id === currentStream?.item?.id);
          const prevIndex = (currentIndex - 1 + channels.length) % channels.length;
          handlePlayChannel(channels[prevIndex]);
        }
        break;
      default:
        break;
    }
  }, [currentStream, showAssistantModal, showSearchModal, showSettingsModal, showPlaylistModal, channels]);

  // Physical Keyboard listener for TV Remote D-Pad Simulation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing inside text input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      switch (e.key) {
        case 'Escape':
        case 'Backspace':
          handleRemoteKey('back');
          break;
        case 'h':
        case 'H':
          handleRemoteKey('home');
          break;
        case 'm':
        case 'M':
          handleRemoteKey('menu');
          break;
        case 'v':
        case 'V':
          handleRemoteKey('mic');
          break;
        case 'i':
        case 'I':
          handleRemoteKey('info');
          break;
        case 'PageUp':
          handleRemoteKey('ch_up');
          break;
        case 'PageDown':
          handleRemoteKey('ch_down');
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRemoteKey]);

  const activePlaylist = playlists.find(p => p.id === activePlaylistId) || null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-500 ${
      settings.theme === 'amoled'
        ? 'bg-black text-white'
        : settings.theme === 'blue-tech'
        ? 'bg-[#060b19] text-slate-100'
        : settings.theme === 'night'
        ? 'bg-[#0f1118] text-amber-50'
        : settings.theme === 'dark'
        ? 'bg-[#0b0f19] text-slate-200'
        : 'bg-[#07090e] text-slate-100' // elifai-premium
    }`}>
      {/* 10-Foot Android TV Navigation Header */}
      <TvNavigationHeader
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        activeProfile={activeProfile}
        activePlaylist={activePlaylist}
        onOpenSearch={() => {
          setShowVoiceSearch(false);
          setShowSearchModal(true);
        }}
        onOpenVoice={() => {
          setShowVoiceSearch(true);
          setShowSearchModal(true);
        }}
        onOpenPlaylistManager={() => setShowPlaylistModal(true)}
        onOpenLegalNotice={() => setShowLegalNotice(true)}
        onOpenApkGuide={() => setShowApkGuideModal(true)}
      />

      {/* Main View Switcher */}
      <main className="flex-1 flex flex-col">
        {currentTab === 'home' && (
          <HomeScreenView
            channels={channels}
            movies={movies}
            series={series}
            radioStations={radioStations}
            onPlayChannel={handlePlayChannel}
            onPlayMovie={handlePlayMovie}
            onPlaySeries={handlePlaySeries}
            onPlayRadio={handlePlayRadio}
            onToggleFavorite={handleToggleFavorite}
            onOpenAssistantWithPrompt={(prompt) => {
              setAssistantInitialPrompt(prompt);
              setShowAssistantModal(true);
            }}
            onOpenApkGuide={() => setShowApkGuideModal(true)}
            onOpenPlaylistManager={() => setShowPlaylistModal(true)}
          />
        )}

        {currentTab === 'live' && (
          <LiveTvView
            channels={channels}
            epgList={epgList}
            onPlayChannel={handlePlayChannel}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'movies' && (
          <VodView
            type="movies"
            movies={movies}
            series={series}
            onPlayMovie={handlePlayMovie}
            onPlaySeries={handlePlaySeries}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'series' && (
          <VodView
            type="series"
            movies={movies}
            series={series}
            onPlayMovie={handlePlayMovie}
            onPlaySeries={handlePlaySeries}
            onToggleFavorite={handleToggleFavorite}
          />
        )}

        {currentTab === 'radio' && (
          <div className="flex-1 max-w-7xl mx-auto w-full p-6 animate-fadeIn">
            <h2 className="text-xl font-bold text-white mb-4">Digital Radio Feeds</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {radioStations.map(rad => (
                <div
                  key={rad.id}
                  onClick={() => handlePlayRadio(rad)}
                  className="p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 cursor-pointer flex items-center gap-4 transition-all"
                >
                  <img src={rad.logo} alt={rad.name} className="w-14 h-14 rounded-xl object-cover" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{rad.name}</h4>
                    <p className="text-xs text-slate-400">{rad.genre} • {rad.bitrate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentTab === 'epg' && (
          <EpgGridGuide
            channels={channels}
            epgList={epgList}
            onPlayChannel={handlePlayChannel}
            onScheduleRecord={handleScheduleRecording}
          />
        )}

        {currentTab === 'recordings' && (
          <RecordingsView
            recordings={recordings}
            onPlayRecording={(rec) => {
              setCurrentStream({
                type: 'channel',
                item: {
                  id: rec.id,
                  name: rec.title,
                  streamUrl: rec.streamUrl,
                  category: 'DVR Recording',
                  channelNumber: 999
                }
              });
            }}
            onDeleteRecording={handleDeleteRecording}
          />
        )}

        {currentTab === 'assistant' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <button
              onClick={() => setShowAssistantModal(true)}
              className="px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-base shadow-xl flex items-center gap-3 animate-pulse"
            >
              <Sparkles className="w-6 h-6" />
              <span>Launch ElifAI Assistant Concierge</span>
            </button>
          </div>
        )}

        {currentTab === 'settings' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <button
              onClick={() => setShowSettingsModal(true)}
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-cyan-500/40 text-cyan-300 font-bold text-base shadow-xl flex items-center gap-3"
            >
              <span>Open TV Settings Console</span>
            </button>
          </div>
        )}

        {currentTab === 'android_codebase' && (
          <AndroidCodebaseViewer />
        )}
      </main>

      {/* Legal & Compliance Branding Footer */}
      <footer className="w-full bg-slate-950/95 border-t border-slate-900 px-6 py-4 flex flex-col md:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-slate-300">
            ElifAI IPTV - Powered by ElifAI
          </span>
          <span>•</span>
          <span className="text-cyan-400 font-medium">Created by Ahmad Bilal</span>
        </div>

        <div className="text-center md:text-right max-w-xl text-[10px] text-slate-500">
          ElifAI IPTV does not provide, host, sell, distribute, or create any TV channels, movies, series, or media content. Users are solely responsible for the content and IPTV services they connect to.
        </div>
      </footer>

      {/* Floating Virtual TV Remote Simulator */}
      <TvRemoteSimulator
        isOpen={showRemote}
        onToggle={() => setShowRemote(!showRemote)}
        onDpadUp={() => handleRemoteKey('up')}
        onDpadDown={() => handleRemoteKey('down')}
        onDpadLeft={() => handleRemoteKey('left')}
        onDpadRight={() => handleRemoteKey('right')}
        onSelect={() => handleRemoteKey('select')}
        onBack={() => handleRemoteKey('back')}
        onHome={() => handleRemoteKey('home')}
        onMenu={() => handleRemoteKey('menu')}
        onMic={() => handleRemoteKey('mic')}
        onInfo={() => handleRemoteKey('info')}
        onPlayPause={() => {
          // Trigger player play/pause if active
        }}
        onChannelUp={() => handleRemoteKey('ch_up')}
        onChannelDown={() => handleRemoteKey('ch_down')}
      />

      {/* Full-screen Media3 ExoPlayer Simulation */}
      {currentStream && (
        <ExoPlayerModal
          currentStream={currentStream}
          channels={channels}
          epgList={epgList}
          settings={settings}
          lastChannel={lastChannel}
          onClose={() => setCurrentStream(null)}
          onSwitchChannel={handlePlayChannel}
          onToggleFavorite={handleToggleFavorite}
          onRecordChannel={handleRecordActiveChannel}
        />
      )}

      {/* ElifAI Conversational Assistant Modal */}
      <ElifAiAssistantModal
        isOpen={showAssistantModal}
        onClose={() => setShowAssistantModal(false)}
        activePlaylistName={activePlaylist?.name}
        currentChannelName={currentStream?.item?.name}
      />

      {/* Universal Search & Voice Search Modal */}
      <UniversalSearchModal
        isOpen={showSearchModal}
        onClose={() => setShowSearchModal(false)}
        channels={channels}
        movies={movies}
        series={series}
        epgList={epgList}
        onPlayItem={(type, item) => {
          if (type === 'channel') handlePlayChannel(item);
          else if (type === 'movie') handlePlayMovie(item);
          else if (type === 'series') handlePlaySeries(item);
        }}
        initialVoiceMode={showVoiceSearch}
      />

      {/* Playlist Manager Modal (Xtream Codes / M3U) */}
      <PlaylistManagerModal
        isOpen={showPlaylistModal}
        onClose={() => setShowPlaylistModal(false)}
        playlists={playlists}
        activePlaylistId={activePlaylistId}
        onSelectPlaylist={(id) => setActivePlaylistId(id)}
        onAddPlaylist={handleAddPlaylist}
        onDeletePlaylist={handleDeletePlaylist}
        onExportBackup={handleExportBackup}
        onImportBackup={handleImportBackup}
      />

      {/* System Settings & Parental Control Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        settings={settings}
        onUpdateSettings={(newVals) => setSettings(prev => ({ ...prev, ...newVals }))}
        onOpenLegal={() => setShowLegalNotice(true)}
        onExportBackup={handleExportBackup}
      />

      {/* Mandatory Regulatory Legal Onboarding Modal */}
      <LegalOnboardingModal
        isOpen={showLegalNotice}
        onAccept={handleAcceptLegal}
        canDismiss={!!localStorage.getItem('elifai_legal_accepted')}
      />

      {/* Official Android TV Release APK & Login Guide Modal */}
      <ApkDownloadGuideModal
        isOpen={showApkGuideModal}
        onClose={() => setShowApkGuideModal(false)}
        onOpenXtreamLogin={() => {
          setShowApkGuideModal(false);
          setShowPlaylistModal(true);
        }}
      />
    </div>
  );
}
