import React, { useState, useEffect, useRef } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize,
  Minimize,
  Heart,
  RotateCcw,
  SkipForward,
  Settings,
  Disc,
  Layers,
  Sparkles,
  Subtitles,
  Tv,
  CheckCircle2,
  X,
  Clock,
  Compass,
  Zap,
  Info
} from 'lucide-react';
import { Channel, VodMovie, EpgProgram, AppSettings } from '../types/iptv';

interface PlayerProps {
  currentStream: {
    type: 'channel' | 'movie' | 'series' | 'radio';
    item: Channel | VodMovie | any;
  } | null;
  channels: Channel[];
  epgList: EpgProgram[];
  settings: AppSettings;
  lastChannel: Channel | null;
  onClose: () => void;
  onSwitchChannel: (channel: Channel) => void;
  onToggleFavorite: (id: string, type: string) => void;
  onRecordChannel: (channel: Channel) => void;
  onUpdateWatchProgress?: (id: string, seconds: number) => void;
}

export const ExoPlayerModal: React.FC<PlayerProps> = ({
  currentStream,
  channels,
  epgList,
  settings,
  lastChannel,
  onClose,
  onSwitchChannel,
  onToggleFavorite,
  onRecordChannel,
  onUpdateWatchProgress
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(0.9);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [showOsd, setShowOsd] = useState<boolean>(true);
  const [showQuickList, setShowQuickList] = useState<boolean>(false);
  const [showTrackModal, setShowTrackModal] = useState<boolean>(false);
  const [selectedQuality, setSelectedQuality] = useState<string>('Auto (1080p)');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '4:3' | 'fill' | 'original'>('16:9');
  const [bufferState, setBufferState] = useState<'healthy' | 'buffering' | 'ready'>('ready');
  const [isPip, setIsPip] = useState<boolean>(false);
  const [recordingToast, setRecordingToast] = useState<string | null>(null);

  // Auto-hide OSD timer
  const osdTimerRef = useRef<NodeJS.Timeout | null>(null);

  const resetOsdTimer = () => {
    setShowOsd(true);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = setTimeout(() => {
      setShowOsd(false);
      setShowQuickList(false);
    }, 5000);
  };

  const item = currentStream?.item;
  const isLive = currentStream?.type === 'channel';

  // Find corresponding EPG for current channel
  const currentEpg = isLive
    ? epgList.find(e => e.channelId === item?.id) || {
        title: 'Live Transmission',
        description: 'Standard broadcasting stream.',
        startTime: '20:00',
        endTime: '22:00'
      }
    : null;

  // Stream initialization with HLS.js or native video
  useEffect(() => {
    if (!item?.streamUrl || !videoRef.current) return;
    const video = videoRef.current;
    const streamUrl = item.streamUrl;

    if (hlsRef.current) {
      hlsRef.current.destroy();
      hlsRef.current = null;
    }

    setBufferState('buffering');

    if (Hls.isSupported() && (streamUrl.includes('.m3u8') || streamUrl.includes('mux.dev'))) {
      const hls = new Hls({
        maxBufferLength: settings.bufferTuning === 'extreme' ? 30 : settings.bufferTuning === 'large' ? 15 : 6,
        maxMaxBufferLength: 60,
        enableWorker: true,
        lowLatencyMode: true,
      });

      hls.loadSource(streamUrl);
      hls.attachMedia(video);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setBufferState('ready');
        video.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.BUFFER_APPENDING, () => {
        setBufferState('buffering');
      });

      hls.on(Hls.Events.BUFFER_APPENDED, () => {
        setBufferState('healthy');
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            case Hls.ErrorTypes.NETWORK_ERROR:
              hls.startLoad();
              break;
            case Hls.ErrorTypes.MEDIA_ERROR:
              hls.recoverMediaError();
              break;
            default:
              hls.destroy();
              break;
          }
        }
      });

      hlsRef.current = hls;
    } else {
      // Native HTML5 Video fallback
      video.src = streamUrl;
      video.play().then(() => {
        setBufferState('healthy');
      }).catch(() => {
        setIsPlaying(false);
      });
    }

    resetOsdTimer();

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }
    };
  }, [item?.streamUrl, settings.bufferTuning]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
    resetOsdTimer();
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
    resetOsdTimer();
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = val;
      setCurrentTime(val);
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleTriggerRecord = () => {
    if (item && isLive) {
      onRecordChannel(item);
      setRecordingToast(`Scheduled recording started: ${item.name} (${settings.storageLocation.toUpperCase()} Storage)`);
      setTimeout(() => setRecordingToast(null), 3500);
    }
  };

  const handleReturnLastChannel = () => {
    if (lastChannel) {
      onSwitchChannel(lastChannel);
    }
  };

  if (!currentStream || !item) return null;

  return (
    <div
      onMouseMove={resetOsdTimer}
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-all ${
        isPip ? 'bottom-8 right-8 w-96 h-56 rounded-2xl shadow-2xl border-2 border-cyan-400 overflow-hidden !fixed' : ''
      }`}
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        playsInline
        autoPlay
        className={`w-full h-full object-contain ${
          aspectRatio === 'fill' ? 'object-cover' : aspectRatio === '4:3' ? 'aspect-[4/3]' : 'aspect-video'
        }`}
        onTimeUpdate={() => {
          if (videoRef.current) {
            setCurrentTime(videoRef.current.currentTime);
            setDuration(videoRef.current.duration || 0);
          }
        }}
        onWaiting={() => setBufferState('buffering')}
        onPlaying={() => setBufferState('healthy')}
      />

      {/* Recording Alert Toast */}
      {recordingToast && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-2.5 rounded-full bg-red-950/90 border border-red-500/50 text-red-200 text-xs font-semibold shadow-xl backdrop-blur-md animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping" />
          <span>{recordingToast}</span>
        </div>
      )}

      {/* On-Screen Display (OSD) Overlay */}
      {showOsd && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/80 flex flex-col justify-between p-6 transition-opacity duration-300 pointer-events-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs tracking-wider border border-cyan-500/30">
                  {isLive ? `CH ${item.channelNumber || 101}` : 'VOD CINEMA'}
                </span>
                <span className="text-white font-bold text-lg tracking-wide drop-shadow">
                  {item.name || item.title}
                </span>
              </div>
              <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Media3 ExoPlayer v1.4.0
              </span>
              <span className={`text-[11px] px-2 py-0.5 rounded font-mono ${
                bufferState === 'healthy' ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/40' : 'bg-amber-950/60 text-amber-400 border border-amber-500/40'
              }`}>
                {bufferState === 'healthy' ? '● BUFFER HEALTHY' : '▲ TUNING BUFFER'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Last Channel Return Button */}
              {lastChannel && isLive && (
                <button
                  onClick={handleReturnLastChannel}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-cyan-300 text-xs border border-cyan-500/30"
                  title="Return to last watched channel"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Return to {lastChannel.name}</span>
                </button>
              )}

              {/* PiP button */}
              <button
                onClick={() => setIsPip(!isPip)}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                title="Picture in Picture / Mini Player"
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Close / Back */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-slate-900/80 hover:bg-red-950/80 text-slate-300 hover:text-red-400 border border-slate-700 hover:border-red-500/40"
                title="Exit Player"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Info Banner (for Live TV EPG) */}
          {isLive && currentEpg && (
            <div className="max-w-xl p-4 rounded-2xl bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md self-start ml-2 shadow-xl">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold">
                <Clock className="w-3.5 h-3.5" />
                <span>{currentEpg.startTime} - {currentEpg.endTime}</span>
                <span className="text-slate-500">•</span>
                <span className="text-slate-300">{item.category}</span>
              </div>
              <h3 className="text-white text-base font-bold mt-1">{currentEpg.title}</h3>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{currentEpg.description}</p>
            </div>
          )}

          {/* Bottom Player Controls */}
          <div className="space-y-3">
            {/* VOD Timeline Scrub Bar */}
            {!isLive && duration > 0 && (
              <div className="space-y-1">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={handleSeek}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>{new Date(currentTime * 1000).toISOString().substr(14, 5)}</span>
                  <span>{new Date(duration * 1000).toISOString().substr(14, 5)}</span>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between">
              {/* Left playback controls */}
              <div className="flex items-center gap-3">
                <button
                  onClick={togglePlay}
                  className="p-3 rounded-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 shadow-lg shadow-cyan-500/30 transition-transform active:scale-95"
                  title="Play / Pause"
                >
                  {isPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current" />}
                </button>

                <button
                  onClick={toggleMute}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                  title="Mute / Unmute"
                >
                  {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Instant Record */}
                {isLive && (
                  <button
                    onClick={handleTriggerRecord}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold"
                    title="Record to Storage"
                  >
                    <Disc className="w-3.5 h-3.5 animate-spin text-red-400" />
                    <span>REC ({settings.storageLocation.toUpperCase()})</span>
                  </button>
                )}

                {/* Favorite toggle */}
                <button
                  onClick={() => onToggleFavorite(item.id, currentStream.type)}
                  className={`p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border ${
                    item.isFavorite ? 'text-red-400 border-red-500/40' : 'text-slate-400 border-slate-700'
                  }`}
                  title="Add to Favorites"
                >
                  <Heart className={`w-4 h-4 ${item.isFavorite ? 'fill-current' : ''}`} />
                </button>

                {/* Quick Channel Switch Drawer Toggle */}
                {isLive && (
                  <button
                    onClick={() => setShowQuickList(!showQuickList)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 text-xs border border-slate-700"
                  >
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Quick Channels</span>
                  </button>
                )}
              </div>

              {/* Right Settings & Track Picker */}
              <div className="flex items-center gap-3">
                {/* Aspect ratio */}
                <button
                  onClick={() => {
                    const ratios: ('16:9' | '4:3' | 'fill' | 'original')[] = ['16:9', '4:3', 'fill', 'original'];
                    const next = ratios[(ratios.indexOf(aspectRatio) + 1) % ratios.length];
                    setAspectRatio(next);
                  }}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs font-mono text-cyan-300 border border-slate-700"
                  title="Aspect Ratio"
                >
                  {aspectRatio.toUpperCase()}
                </button>

                {/* Quality pill */}
                <button
                  onClick={() => setShowTrackModal(!showTrackModal)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-xs text-slate-300 border border-slate-700"
                >
                  <Settings className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{selectedQuality}</span>
                </button>

                {/* Fullscreen */}
                <button
                  onClick={toggleFullscreen}
                  className="p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700"
                  title="Fullscreen"
                >
                  {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Channel Switcher Overlay Drawer */}
      {showQuickList && isLive && (
        <div className="absolute right-0 top-0 bottom-0 w-80 bg-slate-950/95 border-l border-cyan-500/30 p-4 overflow-y-auto z-40 backdrop-blur-xl">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" /> Quick Channel Switch
            </h4>
            <button onClick={() => setShowQuickList(false)} className="text-slate-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-2">
            {channels.map((ch) => (
              <div
                key={ch.id}
                onClick={() => {
                  onSwitchChannel(ch);
                  setShowQuickList(false);
                }}
                className={`flex items-center gap-3 p-2.5 rounded-xl cursor-pointer transition-all ${
                  ch.id === item.id
                    ? 'bg-cyan-500/20 border border-cyan-400 text-white'
                    : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                <img src={ch.logo} alt={ch.name} className="w-8 h-8 rounded-lg object-cover bg-slate-950" />
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold truncate">{ch.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{ch.category}</div>
                </div>
                <span className="text-[10px] font-mono font-bold text-cyan-400">#{ch.channelNumber}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Track & Audio Quality Modal */}
      {showTrackModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-slate-950 border border-cyan-500/40 p-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Settings className="w-4 h-4 text-cyan-400" /> Media3 Stream Configuration
              </h4>
              <button onClick={() => setShowTrackModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Quality Profile</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Auto (1080p)', '1080p FHD', '720p HD', '480p SD'].map((q) => (
                    <button
                      key={q}
                      onClick={() => {
                        setSelectedQuality(q);
                        setShowTrackModal(false);
                      }}
                      className={`p-2 rounded-xl text-left border ${
                        selectedQuality === q
                          ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Hardware Decoding</label>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-200">
                  <span>MediaCodec Tunneling</span>
                  <span className="text-emerald-400 font-bold text-[10px]">ACTIVE</span>
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Buffer Mode</label>
                <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-slate-200">
                  <span className="capitalize">{settings.bufferTuning} Tuning</span>
                  <span className="text-cyan-400 font-mono text-[10px]">
                    {settings.bufferTuning === 'extreme' ? '25s buffer' : settings.bufferTuning === 'large' ? '10s buffer' : '2s buffer'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
