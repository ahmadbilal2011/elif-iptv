import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Search,
  Bell,
  Disc,
  Play,
  Tv,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { Channel, EpgProgram } from '../types/iptv';

interface EpgGridProps {
  channels: Channel[];
  epgList: EpgProgram[];
  onPlayChannel: (channel: Channel) => void;
  onScheduleRecord: (program: EpgProgram, channel: Channel) => void;
}

export const EpgGridGuide: React.FC<EpgGridProps> = ({
  channels,
  epgList,
  onPlayChannel,
  onScheduleRecord
}) => {
  const [selectedProgram, setSelectedProgram] = useState<EpgProgram | null>(
    epgList[0] || null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [reminders, setReminders] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const timeSlots = ['20:30', '21:00', '21:30', '22:00', '22:30', '23:00', '23:30'];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleReminder = (progId: string, title: string) => {
    if (reminders.includes(progId)) {
      setReminders(reminders.filter(id => id !== progId));
      showToast(`Reminder removed: ${title}`);
    } else {
      setReminders([...reminders, progId]);
      showToast(`Reminder set for: ${title}`);
    }
  };

  const filteredChannels = channels.filter(ch =>
    ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ch.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col p-6 space-y-4 max-w-7xl mx-auto w-full animate-fadeIn">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-20 right-8 z-50 px-4 py-2 rounded-xl bg-cyan-950/90 border border-cyan-400 text-cyan-200 text-xs font-semibold shadow-2xl backdrop-blur-md">
          {toastMessage}
        </div>
      )}

      {/* Top Banner / Details Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-cyan-500/20 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex-1 space-y-1">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
            <Calendar className="w-4 h-4" />
            <span>TV GUIDE & XMLTV ELECTRONIC PROGRAM SCHEDULE</span>
            {selectedProgram && (
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                {selectedProgram.category}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-white tracking-wide">
            {selectedProgram ? selectedProgram.title : 'Select a program on the grid'}
          </h2>
          <p className="text-xs text-slate-400 max-w-3xl line-clamp-2">
            {selectedProgram ? selectedProgram.description : 'Explore real-time electronic program guide information across your IPTV library.'}
          </p>
          {selectedProgram && (
            <div className="flex items-center gap-4 text-xs text-slate-300 pt-1 font-mono">
              <span className="flex items-center gap-1 text-cyan-300">
                <Clock className="w-3.5 h-3.5" />
                {selectedProgram.startTime} - {selectedProgram.endTime}
              </span>
              <span>Rating: {selectedProgram.rating || 'G'}</span>
            </div>
          )}
        </div>

        {selectedProgram && (
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => {
                const targetCh = channels.find(c => c.id === selectedProgram.channelId);
                if (targetCh) onPlayChannel(targetCh);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs hover:from-cyan-400 hover:to-blue-500 shadow-md shadow-cyan-500/20"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Watch Live</span>
            </button>

            <button
              onClick={() => {
                const targetCh = channels.find(c => c.id === selectedProgram.channelId);
                if (targetCh) {
                  onScheduleRecord(selectedProgram, targetCh);
                  showToast(`Scheduled DVR recording: ${selectedProgram.title}`);
                }
              }}
              className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-red-950/50 hover:bg-red-900/50 text-red-300 border border-red-500/40 text-xs font-semibold"
            >
              <Disc className="w-4 h-4 text-red-400" />
              <span>Record</span>
            </button>

            <button
              onClick={() => toggleReminder(selectedProgram.id, selectedProgram.title)}
              className={`p-2.5 rounded-xl border text-xs ${
                reminders.includes(selectedProgram.id)
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Set Airing Reminder"
            >
              <Bell className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Guide Filter / Search Bar */}
      <div className="flex items-center justify-between gap-4">
        <div className="relative w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search channels or shows..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>Live Timeline: 21:15 UTC • Auto-Sync: 12h</span>
        </div>
      </div>

      {/* EPG Grid Table (Tivimate Style) */}
      <div className="flex-1 rounded-2xl bg-slate-950/80 border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Timeline Header Row */}
        <div className="flex border-b border-slate-800 bg-slate-900/70 text-xs font-mono font-bold text-slate-400 sticky top-0 z-20">
          <div className="w-64 p-3 border-r border-slate-800 shrink-0 text-slate-300 flex items-center gap-2">
            <Tv className="w-4 h-4 text-cyan-400" />
            <span>CHANNEL ({filteredChannels.length})</span>
          </div>
          <div className="flex-1 grid grid-cols-7 text-center">
            {timeSlots.map((time, idx) => (
              <div key={idx} className="p-3 border-r border-slate-800/60 last:border-r-0">
                {time}
              </div>
            ))}
          </div>
        </div>

        {/* Channels Rows */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
          {filteredChannels.map((channel) => {
            const channelPrograms = epgList.filter(p => p.channelId === channel.id);
            const liveProg = channelPrograms[0] || {
              id: `${channel.id}-dummy-1`,
              channelId: channel.id,
              title: `${channel.name} Broadcasting`,
              description: 'Continuous digital feed.',
              startTime: '20:30',
              endTime: '22:00',
              category: channel.category
            };
            const nextProg = channelPrograms[1] || {
              id: `${channel.id}-dummy-2`,
              channelId: channel.id,
              title: `Late Night Prime: ${channel.category}`,
              description: 'Scheduled broadcast programming.',
              startTime: '22:00',
              endTime: '23:30',
              category: channel.category
            };

            return (
              <div key={channel.id} className="flex hover:bg-slate-900/40 transition-colors">
                {/* Channel Column */}
                <div
                  onClick={() => onPlayChannel(channel)}
                  className="w-64 p-3 border-r border-slate-800 flex items-center gap-3 shrink-0 cursor-pointer group hover:bg-cyan-950/30 transition-all"
                >
                  <img
                    src={channel.logo}
                    alt={channel.name}
                    className="w-9 h-9 rounded-lg object-cover bg-slate-900 border border-slate-800 group-hover:border-cyan-400"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-bold text-white truncate group-hover:text-cyan-300">
                      {channel.name}
                    </div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="font-mono text-cyan-400">#{channel.channelNumber}</span>
                      <span>{channel.category}</span>
                    </div>
                  </div>
                  <Play className="w-3.5 h-3.5 text-slate-600 group-hover:text-cyan-400 shrink-0" />
                </div>

                {/* Programs Horizontal Timeline Grid */}
                <div className="flex-1 grid grid-cols-7 gap-1 p-1">
                  {/* Current Program spanning 4 slots */}
                  <div
                    onClick={() => setSelectedProgram(liveProg as EpgProgram)}
                    className={`col-span-4 p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedProgram?.id === liveProg.id
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                        : 'bg-slate-900/60 border-slate-800 hover:border-cyan-500/40'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-cyan-400 font-mono">
                        <span>LIVE NOW • {liveProg.startTime} - {liveProg.endTime}</span>
                        {reminders.includes(liveProg.id) && <Bell className="w-3 h-3 text-amber-400" />}
                      </div>
                      <div className="text-xs font-bold text-slate-200 mt-1 truncate">
                        {liveProg.title}
                      </div>
                    </div>
                    {/* Live Progress Bar */}
                    <div className="w-full bg-slate-800 h-1 rounded-full overflow-hidden mt-2">
                      <div className="bg-cyan-400 h-full w-[45%]" />
                    </div>
                  </div>

                  {/* Next Program spanning 3 slots */}
                  <div
                    onClick={() => setSelectedProgram(nextProg as EpgProgram)}
                    className={`col-span-3 p-2.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      selectedProgram?.id === nextProg.id
                        ? 'bg-cyan-950/60 border-cyan-400 shadow-md ring-1 ring-cyan-400'
                        : 'bg-slate-900/30 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>UPCOMING • {nextProg.startTime} - {nextProg.endTime}</span>
                        {reminders.includes(nextProg.id) && <Bell className="w-3 h-3 text-amber-400" />}
                      </div>
                      <div className="text-xs font-semibold text-slate-300 mt-1 truncate">
                        {nextProg.title}
                      </div>
                    </div>
                    <div className="text-[10px] text-slate-500 line-clamp-1">
                      {nextProg.category}
                    </div>
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
