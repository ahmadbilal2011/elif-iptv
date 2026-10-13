import React from 'react';
import {
  Play,
  Heart,
  Sparkles,
  Tv,
  Film,
  Clapperboard,
  Clock,
  ChevronRight,
  Star,
  Info
} from 'lucide-react';
import { Channel, VodMovie, VodSeries, RadioStation } from '../types/iptv';

interface HomeScreenProps {
  channels: Channel[];
  movies: VodMovie[];
  series: VodSeries[];
  radioStations: RadioStation[];
  onPlayChannel: (channel: Channel) => void;
  onPlayMovie: (movie: VodMovie) => void;
  onPlaySeries: (series: VodSeries) => void;
  onPlayRadio: (radio: RadioStation) => void;
  onToggleFavorite: (id: string, type: string) => void;
  onOpenAssistantWithPrompt: (prompt: string) => void;
  onOpenApkGuide?: () => void;
  onOpenPlaylistManager?: () => void;
}

export const HomeScreenView: React.FC<HomeScreenProps> = ({
  channels,
  movies,
  series,
  radioStations,
  onPlayChannel,
  onPlayMovie,
  onPlaySeries,
  onPlayRadio,
  onToggleFavorite,
  onOpenAssistantWithPrompt,
  onOpenApkGuide,
  onOpenPlaylistManager
}) => {
  const featuredMovie = movies[0];
  const favoriteChannels = channels.filter(c => c.isFavorite);
  const continueWatching = movies.filter(m => m.resumePosition && m.resumePosition > 0);

  return (
    <div className="flex-1 flex flex-col space-y-8 p-6 max-w-7xl mx-auto w-full animate-fadeIn pb-16">
      {/* Quick TV APK & Xtream Setup Banner Strip */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/30 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <Tv className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white text-xs font-bold">Install ElifAI IPTV on your Television</span>
              <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[9px]">APK v2.5.0</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Download release APK for Android TV / Google TV / Shield, or enter your Xtream Codes credentials.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 w-full sm:w-auto">
          {onOpenApkGuide && (
            <button
              onClick={onOpenApkGuide}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 hover:bg-emerald-400 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>Get APK & Setup Guide</span>
            </button>
          )}
          {onOpenPlaylistManager && (
            <button
              onClick={onOpenPlaylistManager}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-500/30 font-bold text-xs transition-all flex items-center justify-center gap-1.5"
            >
              <span>+ Xtream Login</span>
            </button>
          )}
        </div>
      </div>
      {/* Cinematic Hero Spotlight Banner (Apple TV / Netflix Inspired) */}
      {featuredMovie && (
        <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-cyan-500/30 shadow-2xl group">
          <img
            src={featuredMovie.backdrop}
            alt={featuredMovie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 brightness-75"
          />
          {/* Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/40 to-transparent" />

          {/* Hero Content */}
          <div className="absolute bottom-8 left-8 max-w-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-cyan-500 text-slate-950 font-black text-[11px] tracking-wider uppercase">
                SPOTLIGHT
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-mono text-xs border border-cyan-500/30">
                ★ {featuredMovie.rating}
              </span>
              <span className="text-xs text-slate-300 font-medium">{featuredMovie.year}</span>
              <span className="text-xs text-slate-400">• {featuredMovie.genre}</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-white tracking-wide drop-shadow-md">
              {featuredMovie.title}
            </h1>

            <p className="text-xs md:text-sm text-slate-300 line-clamp-2 leading-relaxed max-w-xl">
              {featuredMovie.synopsis}
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => onPlayMovie(featuredMovie)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-300 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/30 active:scale-95"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Play Now</span>
              </button>

              <button
                onClick={() => onOpenAssistantWithPrompt(`Tell me more about ${featuredMovie.title} and recommend similar titles`)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 border border-cyan-500/30 text-xs font-semibold backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>AI Insights</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Row 1: Continue Watching */}
      {continueWatching.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
              <Clock className="w-4 h-4 text-cyan-400" /> Continue Watching
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {continueWatching.map((item) => (
              <div
                key={item.id}
                onClick={() => onPlayMovie(item)}
                className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
              >
                <div className="relative aspect-video">
                  <img src={item.backdrop} alt={item.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all">
                    <div className="w-10 h-10 rounded-full bg-cyan-500/90 flex items-center justify-center text-slate-950 shadow-md">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                  {/* Progress bar */}
                  <div className="absolute bottom-0 inset-x-0 h-1.5 bg-slate-800">
                    <div className="h-full bg-cyan-400 w-[55%]" />
                  </div>
                </div>
                <div className="p-3">
                  <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                    {item.title}
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Resume at 2:00</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Row 2: Live TV Highlights */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Tv className="w-4 h-4 text-cyan-400" /> Live TV Channels
          </h3>
          <span className="text-xs text-slate-400">{channels.length} Available</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {channels.slice(0, 6).map((ch) => (
            <div
              key={ch.id}
              onClick={() => onPlayChannel(ch)}
              className="group p-3 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/20 cursor-pointer transition-all flex flex-col items-center text-center shadow-md hover:scale-105"
            >
              <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 mb-2">
                <img src={ch.logo} alt={ch.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-0 inset-x-0 bg-black/70 text-[9px] font-mono text-cyan-400">
                  #{ch.channelNumber}
                </span>
              </div>
              <span className="text-xs font-bold text-white group-hover:text-cyan-300 truncate w-full">
                {ch.name}
              </span>
              <span className="text-[10px] text-slate-400 truncate w-full mt-0.5">
                {ch.category}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3: Trending Movies (VOD) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Film className="w-4 h-4 text-cyan-400" /> Trending Movies (VOD)
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {movies.map((m) => (
            <div
              key={m.id}
              onClick={() => onPlayMovie(m)}
              className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg"
            >
              <div className="relative aspect-[2/3] overflow-hidden">
                <img src={m.poster} alt={m.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/75 text-cyan-300 text-[10px] font-mono border border-cyan-500/30">
                  ★ {m.rating}
                </div>
              </div>
              <div className="p-3">
                <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300">{m.title}</div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                  <span>{m.genre}</span>
                  <span>{m.year}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 4: Trending Series */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Clapperboard className="w-4 h-4 text-cyan-400" /> Featured Series
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {series.map((s) => (
            <div
              key={s.id}
              onClick={() => onPlaySeries(s)}
              className="group p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 flex gap-4 cursor-pointer transition-all hover:scale-[1.01]"
            >
              <img src={s.poster} alt={s.title} className="w-24 h-32 rounded-xl object-cover shrink-0 bg-slate-950" />
              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-cyan-300">{s.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono">
                      ★ {s.rating}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">{s.genre} • {s.seasonsCount} Season(s)</div>
                  <p className="text-xs text-slate-300 line-clamp-2 mt-2 leading-relaxed">{s.synopsis}</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-cyan-400 font-bold">
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Season 1</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 5: Radio Channels */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-cyan-400" /> Digital Radio Feeds
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {radioStations.map((rad) => (
            <div
              key={rad.id}
              onClick={() => onPlayRadio(rad)}
              className="p-3 rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 cursor-pointer flex items-center gap-3 transition-all group"
            >
              <img src={rad.logo} alt={rad.name} className="w-12 h-12 rounded-xl object-cover bg-slate-950" />
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">{rad.name}</div>
                <div className="text-[10px] text-slate-400">{rad.genre} • {rad.bitrate}</div>
              </div>
              <Play className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
