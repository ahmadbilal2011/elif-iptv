import React, { useState } from 'react';
import {
  Film,
  Clapperboard,
  Search,
  Play,
  Heart,
  Star,
  Clock,
  Sparkles
} from 'lucide-react';
import { VodMovie, VodSeries } from '../types/iptv';

interface VodViewProps {
  type: 'movies' | 'series';
  movies: VodMovie[];
  series: VodSeries[];
  onPlayMovie: (movie: VodMovie) => void;
  onPlaySeries: (series: VodSeries) => void;
  onToggleFavorite: (id: string, type: string) => void;
}

export const VodView: React.FC<VodViewProps> = ({
  type,
  movies,
  series,
  onPlayMovie,
  onPlaySeries,
  onToggleFavorite
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const isMovies = type === 'movies';
  const rawList = isMovies ? movies : series;

  const genres = ['All', 'Favorites', ...Array.from(new Set(rawList.map(item => item.genre)))];

  const filteredItems = rawList.filter(item => {
    const matchesGenre =
      selectedGenre === 'All'
        ? true
        : selectedGenre === 'Favorites'
        ? item.isFavorite
        : item.genre === selectedGenre;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genre.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesGenre && matchesSearch;
  });

  return (
    <div className="flex-1 flex max-w-7xl mx-auto w-full p-6 gap-6 animate-fadeIn">
      {/* Genre Sidebar */}
      <div className="w-56 bg-slate-950/80 border border-slate-800 rounded-3xl p-3 flex flex-col space-y-1 shrink-0 h-[80vh]">
        <div className="p-3 text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          {isMovies ? <Film className="w-4 h-4" /> : <Clapperboard className="w-4 h-4" />}
          <span>{isMovies ? 'Movie Genres' : 'Series Genres'}</span>
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {genres.map((g) => {
            const count =
              g === 'All'
                ? rawList.length
                : g === 'Favorites'
                ? rawList.filter(i => i.isFavorite).length
                : rawList.filter(i => i.genre === g).length;

            return (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedGenre === g
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{g}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedGenre === g ? 'bg-slate-900/30 text-slate-950' : 'bg-slate-900 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid Area */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Search Input */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${isMovies ? 'movies' : 'series'} by title...`}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {filteredItems.length} title(s)
          </div>
        </div>

        {/* Card Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 pr-2">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              onClick={() => {
                if (isMovies) onPlayMovie(item as VodMovie);
                else onPlaySeries(item as VodSeries);
              }}
              className="group relative rounded-2xl bg-slate-900 border border-slate-800 hover:border-cyan-400 overflow-hidden cursor-pointer transition-all hover:scale-[1.02] shadow-lg flex flex-col justify-between"
            >
              <div className="relative aspect-[2/3] overflow-hidden bg-slate-950">
                <img
                  src={item.poster}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-cyan-300 text-[10px] font-mono border border-cyan-500/30 flex items-center gap-1">
                  <Star className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                  <span>{item.rating}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id, isMovies ? 'movie' : 'series');
                  }}
                  className={`absolute top-2 left-2 p-1.5 rounded-lg border backdrop-blur-md ${
                    item.isFavorite
                      ? 'bg-red-500/40 text-red-300 border-red-500/60'
                      : 'bg-black/60 text-slate-400 border-slate-700 hover:text-white'
                  }`}
                >
                  <Heart className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>
              </div>

              <div className="p-3">
                <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                  {item.title}
                </div>
                <div className="text-[10px] text-slate-400 flex items-center justify-between mt-1">
                  <span className="truncate">{item.genre}</span>
                  <span>{isMovies ? (item as VodMovie).year : `${(item as VodSeries).seasonsCount}S`}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
