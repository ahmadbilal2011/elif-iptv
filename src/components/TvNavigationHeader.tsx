import React, { useState, useEffect } from 'react';
import {
  Tv,
  Film,
  Clapperboard,
  Radio,
  Calendar,
  Disc,
  Bot,
  Settings,
  Search,
  Mic,
  Code2,
  FolderSync,
  User,
  Wifi,
  Sparkles
} from 'lucide-react';
import { UserProfile, Playlist } from '../types/iptv';

export type NavigationTab =
  | 'home'
  | 'live'
  | 'movies'
  | 'series'
  | 'radio'
  | 'epg'
  | 'recordings'
  | 'assistant'
  | 'settings'
  | 'android_codebase';

interface TvHeaderProps {
  currentTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  activeProfile: UserProfile;
  activePlaylist: Playlist | null;
  onOpenSearch: () => void;
  onOpenVoice: () => void;
  onOpenPlaylistManager: () => void;
  onOpenLegalNotice: () => void;
  onOpenApkGuide: () => void;
}

export const TvNavigationHeader: React.FC<TvHeaderProps> = ({
  currentTab,
  onSelectTab,
  activeProfile,
  activePlaylist,
  onOpenSearch,
  onOpenVoice,
  onOpenPlaylistManager,
  onOpenLegalNotice,
  onOpenApkGuide
}) => {
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navItems: { id: NavigationTab; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Tv className="w-4 h-4" /> },
    { id: 'live', label: 'Live TV', icon: <Tv className="w-4 h-4" /> },
    { id: 'movies', label: 'Movies', icon: <Film className="w-4 h-4" /> },
    { id: 'series', label: 'Series', icon: <Clapperboard className="w-4 h-4" /> },
    { id: 'radio', label: 'Radio', icon: <Radio className="w-4 h-4" /> },
    { id: 'epg', label: 'TV Guide', icon: <Calendar className="w-4 h-4" /> },
    { id: 'recordings', label: 'Recordings', icon: <Disc className="w-4 h-4" /> },
    { id: 'assistant', label: 'ElifAI Assistant', icon: <Bot className="w-4 h-4 text-cyan-400" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> },
    { id: 'android_codebase', label: 'Android Codebase', icon: <Code2 className="w-4 h-4 text-emerald-400" /> },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/90 backdrop-blur-md border-b border-cyan-500/20 px-6 py-3 transition-all">
      <div className="flex items-center justify-between gap-4">
        {/* Brand & Creator Badge */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-600 to-indigo-900 flex items-center justify-center shadow-lg shadow-cyan-500/20 ring-1 ring-cyan-400/40">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-wider text-white">
                Elif<span className="text-cyan-400">AI</span> IPTV
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
                PRO TV
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-medium">
              Powered by ElifAI • Created by Ahmad Bilal
            </div>
          </div>
        </div>

        {/* 10-Foot Horizontal Navigation Bar */}
        <nav className="flex items-center gap-1 overflow-x-auto scrollbar-none py-1">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-md shadow-cyan-500/30 scale-105'
                    : 'text-slate-300 hover:text-white hover:bg-slate-900/80'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Icons & Clock */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Direct Install APK Button */}
          <button
            onClick={onOpenApkGuide}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all shadow-sm active:scale-95 animate-pulse"
            title="Download Android TV APK & Login Guide"
          >
            <Tv className="w-3.5 h-3.5 text-emerald-400" />
            <span>Install APK on TV</span>
          </button>

          {/* Universal Search button */}
          <button
            onClick={onOpenSearch}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 transition-all"
            title="Universal Search (Channels, Movies, Series, EPG)"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Voice Search button */}
          <button
            onClick={onOpenVoice}
            className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/40 hover:border-cyan-400 text-cyan-300 hover:text-cyan-200 transition-all group"
            title="Google Voice Search & Voice Assistant"
          >
            <Mic className="w-4 h-4 group-hover:scale-110 transition-transform" />
          </button>

          {/* Playlist Switcher Button */}
          <button
            onClick={onOpenPlaylistManager}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-xs font-medium text-slate-300"
            title="Manage Playlists & Xtream Codes"
          >
            <FolderSync className="w-3.5 h-3.5 text-cyan-400" />
            <span className="max-w-[100px] truncate">{activePlaylist ? activePlaylist.name : 'No Playlist'}</span>
          </button>

          {/* User Profile Badge */}
          <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800">
            <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-xs font-bold">
              {activeProfile.name[0]}
            </div>
            <span className="hidden md:inline text-xs font-medium text-slate-200">
              {activeProfile.name}
            </span>
          </div>

          {/* TV Clock */}
          <div className="text-right pl-2 border-l border-slate-800">
            <div className="text-sm font-mono font-bold text-white tracking-wider">
              {currentTime}
            </div>
            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-400 font-semibold">
              <Wifi className="w-2.5 h-2.5" />
              <span>4K HDR</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
