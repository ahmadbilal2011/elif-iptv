import React, { useState } from 'react';
import {
  Tv,
  Heart,
  Search,
  Play,
  Clock,
  Sparkles,
  Lock,
  ChevronRight
} from 'lucide-react';
import { Channel, EpgProgram } from '../types/iptv';

interface LiveTvViewProps {
  channels: Channel[];
  epgList: EpgProgram[];
  onPlayChannel: (channel: Channel) => void;
  onToggleFavorite: (id: string, type: string) => void;
}

export const LiveTvView: React.FC<LiveTvViewProps> = ({
  channels,
  epgList,
  onPlayChannel,
  onToggleFavorite
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [hoveredChannel, setHoveredChannel] = useState<Channel | null>(channels[0] || null);

  const categories = ['All', 'Favorites', ...Array.from(new Set(channels.map(c => c.category)))];

  const filteredChannels = channels.filter(ch => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Favorites'
        ? ch.isFavorite
        : ch.category === selectedCategory;

    const matchesSearch =
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.channelNumber.toString().includes(searchQuery);

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex-1 flex max-w-7xl mx-auto w-full p-6 gap-6 animate-fadeIn">
      {/* Category Sidebar */}
      <div className="w-56 bg-slate-950/80 border border-slate-800 rounded-3xl p-3 flex flex-col space-y-1 shrink-0 h-[80vh]">
        <div className="p-3 text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-2">
          <Tv className="w-4 h-4" /> Categories
        </div>
        <div className="flex-1 overflow-y-auto space-y-1">
          {categories.map((cat) => {
            const count =
              cat === 'All'
                ? channels.length
                : cat === 'Favorites'
                ? channels.filter(c => c.isFavorite).length
                : channels.filter(c => c.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                  selectedCategory === cat ? 'bg-slate-900/30 text-slate-950' : 'bg-slate-900 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Channel List Area */}
      <div className="flex-1 flex flex-col space-y-4">
        {/* Search Input */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by channel name or number..."
              className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
          <div className="text-xs text-slate-400 font-mono">
            Showing {filteredChannels.length} channel(s)
          </div>
        </div>

        {/* Channel Grid / List */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3 pr-2">
          {filteredChannels.map((channel) => {
            const epg = epgList.find(e => e.channelId === channel.id);
            return (
              <div
                key={channel.id}
                onMouseEnter={() => setHoveredChannel(channel)}
                onClick={() => onPlayChannel(channel)}
                className="group p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-400 hover:bg-cyan-950/20 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-md hover:scale-[1.01]"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="relative w-12 h-12 rounded-xl bg-slate-950 border border-slate-800 shrink-0 overflow-hidden group-hover:border-cyan-400">
                    <img src={channel.logo} alt={channel.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 inset-x-0 bg-black/80 text-[8px] font-mono text-center text-cyan-400">
                      #{channel.channelNumber}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-bold text-white group-hover:text-cyan-300 truncate">
                      {channel.name}
                    </div>
                    <div className="text-[11px] text-cyan-400/90 truncate mt-0.5">
                      {epg ? epg.title : 'Live Broadcast Feed'}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {channel.category} {epg ? `• ${epg.startTime} - ${epg.endTime}` : ''}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(channel.id, 'channel');
                    }}
                    className={`p-2 rounded-xl border ${
                      channel.isFavorite
                        ? 'bg-red-500/20 text-red-400 border-red-500/40'
                        : 'bg-slate-950 text-slate-600 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${channel.isFavorite ? 'fill-current' : ''}`} />
                  </button>
                  <div className="p-2.5 rounded-xl bg-slate-950 text-cyan-400 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors shadow">
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
