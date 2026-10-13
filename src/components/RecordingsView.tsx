import React from 'react';
import {
  Disc,
  HardDrive,
  Usb,
  Play,
  Trash2,
  Calendar,
  Clock,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Recording } from '../types/iptv';

interface RecordingsProps {
  recordings: Recording[];
  onPlayRecording: (rec: Recording) => void;
  onDeleteRecording: (id: string) => void;
}

export const RecordingsView: React.FC<RecordingsProps> = ({
  recordings,
  onPlayRecording,
  onDeleteRecording
}) => {
  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 space-y-6 animate-fadeIn">
      {/* Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-red-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 shadow-md">
            <Disc className="w-6 h-6 animate-spin" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
              DVR & Recording Manager
            </h2>
            <p className="text-xs text-slate-400">
              Manage scheduled airings, local captures, and USB storage exports
            </p>
          </div>
        </div>

        {/* Storage Capacity Status Bars */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <HardDrive className="w-3.5 h-3.5 text-cyan-400" /> Internal: 18.4 GB Free
            </div>
            <div className="w-32 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-cyan-400 h-full w-[35%]" />
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
            <div className="flex items-center gap-1.5 text-slate-300 font-bold">
              <Usb className="w-3.5 h-3.5 text-red-400" /> USB Drive: 930.2 GB Free
            </div>
            <div className="w-32 bg-slate-800 h-1 rounded-full mt-1.5 overflow-hidden">
              <div className="bg-red-400 h-full w-[12%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Recordings Table / List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Recorded & Scheduled Airings ({recordings.length})
        </h3>

        {recordings.length === 0 ? (
          <div className="text-center py-16 text-slate-500 space-y-2 rounded-2xl border border-slate-800 bg-slate-950/60">
            <Disc className="w-10 h-10 mx-auto text-slate-700" />
            <p className="text-sm font-semibold text-slate-400">No active recordings found</p>
            <p className="text-xs text-slate-500">
              Press the &ldquo;REC&rdquo; button in the player or schedule recordings from the TV Guide.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {recordings.map((rec) => (
              <div
                key={rec.id}
                className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-red-500/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-all"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`p-3 rounded-xl border shrink-0 ${
                    rec.status === 'completed'
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                      : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                  }`}>
                    {rec.storageType === 'usb' ? <Usb className="w-5 h-5" /> : <HardDrive className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{rec.title}</span>
                      <span className={`text-[10px] uppercase font-mono font-bold px-2 py-0.5 rounded-full ${
                        rec.status === 'completed'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                      }`}>
                        {rec.status}
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                        {rec.storageType.toUpperCase()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                      <span>Channel: {rec.channelName}</span>
                      <span>•</span>
                      <span>{rec.startTime}</span>
                      <span>•</span>
                      <span>{rec.durationMinutes} min</span>
                      {rec.fileSizeBytes && (
                        <span>• {(rec.fileSizeBytes / (1024 * 1024 * 1024)).toFixed(2)} GB</span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                      {rec.filePath}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto">
                  {rec.status === 'completed' && (
                    <button
                      onClick={() => onPlayRecording(rec)}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 hover:bg-cyan-400 font-bold text-xs shadow-md transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Play Recording</span>
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteRecording(rec.id)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-400 transition-all border border-slate-700"
                    title="Delete Recording File"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
