export interface Channel {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  category: string;
  channelNumber: number;
  isFavorite: boolean;
  isLocked?: boolean;
  drmType?: 'none' | 'widevine' | 'clearkey';
  epgChannelId?: string;
}

export interface VodMovie {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  genre: string;
  year: number;
  rating: number;
  duration: number; // in minutes
  streamUrl: string;
  resumePosition?: number; // in seconds
  synopsis: string;
  director?: string;
  cast?: string[];
  isFavorite?: boolean;
}

export interface VodSeries {
  id: string;
  title: string;
  poster: string;
  backdrop: string;
  genre: string;
  seasonsCount: number;
  synopsis: string;
  rating: number;
  isFavorite?: boolean;
  seasons: {
    seasonNumber: number;
    episodes: {
      episodeNumber: number;
      title: string;
      duration: number;
      streamUrl: string;
      thumbnail?: string;
    }[];
  }[];
}

export interface RadioStation {
  id: string;
  name: string;
  logo: string;
  streamUrl: string;
  genre: string;
  bitrate: string;
  isFavorite?: boolean;
}

export interface EpgProgram {
  id: string;
  channelId: string;
  title: string;
  description: string;
  startTime: string; // ISO string or HH:mm
  endTime: string;
  startTimestamp: number;
  endTimestamp: number;
  category: string;
  rating?: string;
}

export interface Recording {
  id: string;
  title: string;
  channelName: string;
  channelLogo?: string;
  streamUrl: string;
  startTime: string;
  durationMinutes: number;
  storageType: 'internal' | 'usb';
  filePath: string;
  status: 'scheduled' | 'recording' | 'completed' | 'failed';
  fileSizeBytes?: number;
}

export interface Playlist {
  id: string;
  name: string;
  type: 'xtream' | 'm3u_url' | 'm3u_file' | 'local_demo';
  serverUrl?: string;
  username?: string;
  password?: string;
  m3uUrl?: string;
  contentCount: {
    live: number;
    vod: number;
    series: number;
    radio: number;
  };
  isActive: boolean;
  lastUpdated: string;
  expiryDate?: string;
  maxConnections?: number;
}

export interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  isKids: boolean;
  isPinProtected: boolean;
  pin?: string;
  lastWatchedChannelId?: string;
}

export type ThemeType = 'dark' | 'night' | 'amoled' | 'blue-tech' | 'elifai-premium' | 'auto';

export interface AppSettings {
  theme: ThemeType;
  bufferTuning: 'standard' | 'large' | 'extreme'; // 2s, 10s, 25s
  hardwareDecoding: boolean;
  audioPassthrough: boolean;
  autoEpgRefreshHours: number;
  manualEpgUrl: string;
  parentalPin: string;
  adultLocked: boolean;
  safeMode: boolean;
  storageLocation: 'internal' | 'usb';
  aiProviderPreference: 'openrouter' | 'gemini' | 'ollama' | 'offline';
  lastChannelReturn: boolean;
  pictureInPictureEnabled: boolean;
}
