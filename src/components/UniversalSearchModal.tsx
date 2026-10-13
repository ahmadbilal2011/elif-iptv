import React, { useState } from 'react';
import {
  Search,
  Mic,
  MicOff,
  Sparkles,
  Tv,
  Film,
  Clapperboard,
  Calendar,
  X,
  Play,
  ArrowRight
} from 'lucide-react';
import { Channel, VodMovie, VodSeries, EpgProgram } from '../types/iptv';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  channels: Channel[];
  movies: VodMovie[];
  series: VodSeries[];
  epgList: EpgProgram[];
  onPlayItem: (type: 'channel' | 'movie' | 'series', item: any) => void;
  initialVoiceMode?: boolean;
}

export const UniversalSearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  channels,
  movies,
  series,
  epgList,
  onPlayItem,
  initialVoiceMode = false
}) => {
  const [query, setQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [aiSuggestionsActive, setAiSuggestionsActive] = useState(false);

  if (!isOpen) return null;

  const aiVoiceExamples = [
    "Find sports channels",
    "Show action movies",
    "Find kids animation",
    "Show documentary series",
    "What football matches are on?"
  ];

  const handleVoiceTrigger = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setQuery("sports");
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      recognition.onresult = (e: any) => {
        const text = e.results[0][0].transcript;
        setIsListening(false);
        setQuery(text);
      };
      recognition.onerror = () => setIsListening(false);
      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch {
      setIsListening(false);
    }
  };

  const cleanQuery = query.toLowerCase().trim();

  // Search matches
  const matchedChannels = channels.filter(c =>
    cleanQuery && (c.name.toLowerCase().includes(cleanQuery) || c.category.toLowerCase().includes(cleanQuery))
  );

  const matchedMovies = movies.filter(m =>
    cleanQuery && (m.title.toLowerCase().includes(cleanQuery) || m.genre.toLowerCase().includes(cleanQuery))
  );

  const matchedSeries = series.filter(s =>
    cleanQuery && (s.title.toLowerCase().includes(cleanQuery) || s.genre.toLowerCase().includes(cleanQuery))
  );

  const matchedEpg = epgList.filter(e =>
    cleanQuery && (e.title.toLowerCase().includes(cleanQuery) || e.description.toLowerCase().includes(cleanQuery))
  );

  const totalResults = matchedChannels.length + matchedMovies.length + matchedSeries.length + matchedEpg.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden max-h-[88vh]">
        {/* Search Input Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-950 border-b border-slate-800 flex items-center gap-3">
          <Search className="w-5 h-5 text-cyan-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search channels, movies, series, or ask: 'Find action films'..."
            className="flex-1 bg-transparent text-sm text-white placeholder-slate-500 focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={handleVoiceTrigger}
            className={`p-2.5 rounded-xl border transition-all ${
              isListening
                ? 'bg-red-500 text-white animate-pulse border-red-400'
                : 'bg-cyan-950/60 border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/50'
            }`}
            title="Google Voice & Remote Mic Search"
          >
            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Suggested Queries Strip */}
        <div className="px-5 py-2.5 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs">
          <span className="text-cyan-400 font-bold flex items-center gap-1 shrink-0">
            <Sparkles className="w-3.5 h-3.5" /> AI Search:
          </span>
          {aiVoiceExamples.map((ex, i) => (
            <button
              key={i}
              onClick={() => setQuery(ex)}
              className="px-2.5 py-1 rounded-full bg-slate-900 hover:bg-cyan-950 text-slate-300 hover:text-cyan-300 border border-slate-800 text-[11px] whitespace-nowrap"
            >
              &ldquo;{ex}&rdquo;
            </button>
          ))}
        </div>

        {/* Results Area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {!query && (
            <div className="text-center py-12 text-slate-400 space-y-2">
              <Search className="w-10 h-10 text-cyan-500/40 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-300">Universal TV Search Ready</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Search across all your playlists, channels, video on demand, and EPG schedules using your remote keyboard or voice assistant.
              </p>
            </div>
          )}

          {query && totalResults === 0 && (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-slate-500 mt-1">Try another keyword or category name.</p>
            </div>
          )}

          {/* Channels Section */}
          {matchedChannels.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Tv className="w-3.5 h-3.5" /> Channels ({matchedChannels.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedChannels.map(ch => (
                  <div
                    key={ch.id}
                    onClick={() => {
                      onPlayItem('channel', ch);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={ch.logo} alt={ch.name} className="w-8 h-8 rounded-lg object-cover bg-slate-950" />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">{ch.name}</div>
                        <div className="text-[10px] text-slate-400">{ch.category} • #{ch.channelNumber}</div>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movies Section */}
          {matchedMovies.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Film className="w-3.5 h-3.5" /> Movies ({matchedMovies.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedMovies.map(m => (
                  <div
                    key={m.id}
                    onClick={() => {
                      onPlayItem('movie', m);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={m.poster} alt={m.title} className="w-8 h-10 rounded object-cover bg-slate-950" />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">{m.title}</div>
                        <div className="text-[10px] text-slate-400">{m.genre} • {m.year}</div>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Series Section */}
          {matchedSeries.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Clapperboard className="w-3.5 h-3.5" /> Series ({matchedSeries.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {matchedSeries.map(s => (
                  <div
                    key={s.id}
                    onClick={() => {
                      onPlayItem('series', s);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-400 cursor-pointer flex items-center justify-between group transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <img src={s.poster} alt={s.title} className="w-8 h-10 rounded object-cover bg-slate-950" />
                      <div>
                        <div className="text-xs font-bold text-white group-hover:text-cyan-300">{s.title}</div>
                        <div className="text-[10px] text-slate-400">{s.genre} • {s.seasonsCount} Seasons</div>
                      </div>
                    </div>
                    <Play className="w-4 h-4 text-slate-600 group-hover:text-cyan-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* EPG Schedule Section */}
          {matchedEpg.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" /> TV Guide Shows ({matchedEpg.length})
              </h4>
              <div className="grid grid-cols-1 gap-2">
                {matchedEpg.map(e => (
                  <div
                    key={e.id}
                    className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{e.title}</div>
                      <div className="text-[10px] text-slate-400">{e.startTime} - {e.endTime} • {e.category}</div>
                    </div>
                    <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                      EPG MATCH
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
