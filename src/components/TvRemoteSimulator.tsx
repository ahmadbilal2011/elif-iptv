import React, { useState } from 'react';
import {
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Circle,
  ArrowLeft,
  Home,
  Mic,
  Volume2,
  VolumeX,
  Menu,
  Info,
  Play,
  Pause,
  Power,
  Tv,
  Keyboard,
  X
} from 'lucide-react';

interface TvRemoteProps {
  onDpadUp: () => void;
  onDpadDown: () => void;
  onDpadLeft: () => void;
  onDpadRight: () => void;
  onSelect: () => void;
  onBack: () => void;
  onHome: () => void;
  onMenu: () => void;
  onMic: () => void;
  onInfo: () => void;
  onPlayPause: () => void;
  onChannelUp: () => void;
  onChannelDown: () => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const TvRemoteSimulator: React.FC<TvRemoteProps> = ({
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  onSelect,
  onBack,
  onHome,
  onMenu,
  onMic,
  onInfo,
  onPlayPause,
  onChannelUp,
  onChannelDown,
  isOpen,
  onToggle
}) => {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [showKeyHints, setShowKeyHints] = useState(false);

  const pressEffect = (keyName: string, action: () => void) => {
    setActiveKey(keyName);
    action();
    setTimeout(() => setActiveKey(null), 180);
  };

  if (!isOpen) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 border border-cyan-400/50 shadow-lg backdrop-blur-md transition-all hover:scale-105 active:scale-95"
        title="Open Android TV Remote Simulator"
      >
        <Tv className="w-5 h-5 text-cyan-400 animate-pulse" />
        <span className="text-xs font-semibold tracking-wider uppercase">TV Remote</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-center">
      {/* Remote Chassis */}
      <div className="w-64 rounded-3xl bg-slate-950/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl p-4 flex flex-col items-center text-slate-200">
        {/* Header Bar */}
        <div className="w-full flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-bold tracking-wider text-cyan-300">SHIELD TV REMOTE</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setShowKeyHints(!showKeyHints)}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Keyboard hints"
            >
              <Keyboard className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onToggle}
              className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
              title="Close remote"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Keyboard shortcut banner */}
        {showKeyHints && (
          <div className="my-2 p-2 rounded-lg bg-cyan-950/40 border border-cyan-500/30 text-[10px] text-cyan-200 leading-tight space-y-1 w-full">
            <div>• <kbd className="bg-slate-800 px-1 rounded">Arrow Keys</kbd>: D-Pad Nav</div>
            <div>• <kbd className="bg-slate-800 px-1 rounded">Enter</kbd>: Select / OK</div>
            <div>• <kbd className="bg-slate-800 px-1 rounded">Esc</kbd> / <kbd className="bg-slate-800 px-1 rounded">Backspace</kbd>: Back</div>
            <div>• <kbd className="bg-slate-800 px-1 rounded">V</kbd>: Google Voice / Mic</div>
            <div>• <kbd className="bg-slate-800 px-1 rounded">M</kbd>: Menu / Assistant</div>
          </div>
        )}

        {/* Top Control Buttons */}
        <div className="w-full grid grid-cols-3 gap-2 mt-3">
          <button
            onClick={() => pressEffect('power', onHome)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:bg-red-950/20 text-red-400 transition-all ${
              activeKey === 'power' ? 'scale-95 bg-red-900/40 ring-2 ring-red-400' : ''
            }`}
          >
            <Power className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Power</span>
          </button>

          <button
            onClick={() => pressEffect('mic', onMic)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 hover:border-cyan-400 hover:bg-cyan-900/40 text-cyan-300 transition-all ${
              activeKey === 'mic' ? 'scale-95 ring-2 ring-cyan-400' : ''
            }`}
          >
            <Mic className="w-4 h-4 animate-pulse" />
            <span className="text-[9px] mt-0.5 font-bold">Voice</span>
          </button>

          <button
            onClick={() => pressEffect('menu', onMenu)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300 transition-all ${
              activeKey === 'menu' ? 'scale-95 ring-2 ring-cyan-400' : ''
            }`}
          >
            <Menu className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Menu</span>
          </button>
        </div>

        {/* Circular D-Pad */}
        <div className="relative w-44 h-44 my-4 rounded-full bg-slate-900/90 border-2 border-slate-700/80 p-2 shadow-inner flex items-center justify-center">
          {/* UP */}
          <button
            onClick={() => pressEffect('up', onDpadUp)}
            className={`absolute top-2 w-14 h-11 flex items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-95 transition-all ${
              activeKey === 'up' ? 'text-cyan-400 scale-90' : ''
            }`}
            title="D-Pad Up"
          >
            <ChevronUp className="w-7 h-7" />
          </button>

          {/* DOWN */}
          <button
            onClick={() => pressEffect('down', onDpadDown)}
            className={`absolute bottom-2 w-14 h-11 flex items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-95 transition-all ${
              activeKey === 'down' ? 'text-cyan-400 scale-90' : ''
            }`}
            title="D-Pad Down"
          >
            <ChevronDown className="w-7 h-7" />
          </button>

          {/* LEFT */}
          <button
            onClick={() => pressEffect('left', onDpadLeft)}
            className={`absolute left-2 w-11 h-14 flex items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-95 transition-all ${
              activeKey === 'left' ? 'text-cyan-400 scale-90' : ''
            }`}
            title="D-Pad Left"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>

          {/* RIGHT */}
          <button
            onClick={() => pressEffect('right', onDpadRight)}
            className={`absolute right-2 w-11 h-14 flex items-center justify-center text-slate-300 hover:text-cyan-400 active:scale-95 transition-all ${
              activeKey === 'right' ? 'text-cyan-400 scale-90' : ''
            }`}
            title="D-Pad Right"
          >
            <ChevronRight className="w-7 h-7" />
          </button>

          {/* CENTER OK / SELECT */}
          <button
            onClick={() => pressEffect('select', onSelect)}
            className={`w-18 h-18 rounded-full bg-gradient-to-br from-slate-800 to-slate-950 border border-cyan-500/40 hover:border-cyan-400 shadow-md flex flex-col items-center justify-center text-cyan-300 hover:text-cyan-200 transition-all ${
              activeKey === 'select' ? 'scale-90 bg-cyan-900/60 ring-2 ring-cyan-400' : ''
            }`}
            title="Select / OK"
          >
            <Circle className="w-5 h-5 fill-cyan-400/20" />
            <span className="text-[10px] font-bold tracking-wider mt-0.5">OK</span>
          </button>
        </div>

        {/* Back / Home / Info row */}
        <div className="w-full grid grid-cols-3 gap-2">
          <button
            onClick={() => pressEffect('back', onBack)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all ${
              activeKey === 'back' ? 'scale-95 ring-2 ring-cyan-400' : ''
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Back</span>
          </button>

          <button
            onClick={() => pressEffect('home', onHome)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all ${
              activeKey === 'home' ? 'scale-95 ring-2 ring-cyan-400' : ''
            }`}
          >
            <Home className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Home</span>
          </button>

          <button
            onClick={() => pressEffect('info', onInfo)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 transition-all ${
              activeKey === 'info' ? 'scale-95 ring-2 ring-cyan-400' : ''
            }`}
          >
            <Info className="w-4 h-4" />
            <span className="text-[9px] mt-0.5">Info</span>
          </button>
        </div>

        {/* Channel Up / Down & Play / Pause */}
        <div className="w-full grid grid-cols-3 gap-2 mt-2">
          <button
            onClick={() => pressEffect('ch-up', onChannelUp)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300"
          >
            <span className="text-[11px] font-bold text-cyan-400">CH +</span>
          </button>

          <button
            onClick={() => pressEffect('play', onPlayPause)}
            className={`flex flex-col items-center justify-center p-2 rounded-xl bg-cyan-950/40 border border-cyan-500/40 text-cyan-300 transition-all ${
              activeKey === 'play' ? 'scale-95 ring-2 ring-cyan-400' : ''
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="text-[9px] mt-0.5">Play</span>
          </button>

          <button
            onClick={() => pressEffect('ch-down', onChannelDown)}
            className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/50 text-slate-300"
          >
            <span className="text-[11px] font-bold text-cyan-400">CH -</span>
          </button>
        </div>

        {/* Brand attribution footer on remote */}
        <div className="mt-3 pt-2 text-center border-t border-slate-800/80 w-full">
          <span className="text-[9px] text-slate-400 tracking-wider">
            ElifAI IPTV • Ahmad Bilal
          </span>
        </div>
      </div>
    </div>
  );
};
