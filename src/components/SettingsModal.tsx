import React, { useState } from 'react';
import {
  Settings,
  Tv,
  Play,
  Volume2,
  HardDrive,
  Palette,
  Bot,
  Lock,
  Download,
  ShieldCheck,
  X,
  CheckCircle2,
  AlertTriangle,
  Sliders,
  Cpu
} from 'lucide-react';
import { AppSettings, ThemeType } from '../types/iptv';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: AppSettings;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenLegal: () => void;
  onExportBackup: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onOpenLegal,
  onExportBackup
}) => {
  const [activeSection, setActiveSection] = useState<
    'playback' | 'themes' | 'recording' | 'ai' | 'parental' | 'epg' | 'backup' | 'about'
  >('playback');

  const [pinInput, setPinInput] = useState(settings.parentalPin || '0000');
  const [pinSuccess, setPinSuccess] = useState(false);

  if (!isOpen) return null;

  const themes: { id: ThemeType; label: string; desc: string; preview: string }[] = [
    {
      id: 'elifai-premium',
      label: 'ElifAI Premium (Futuristic Cyan)',
      desc: 'Matte Black, Deep Space Blue, Electric Cyan glow',
      preview: 'from-cyan-500 to-blue-600'
    },
    {
      id: 'blue-tech',
      label: 'Blue Tech',
      desc: 'Deep cobalt blue with bright electric accents',
      preview: 'from-blue-600 to-indigo-700'
    },
    {
      id: 'amoled',
      label: 'AMOLED Pure Black',
      desc: 'Deepest #000000 blacks for OLED TV panels',
      preview: 'from-black to-slate-950'
    },
    {
      id: 'dark',
      label: 'Dark Mode',
      desc: 'Refined charcoal slate for cozy viewing',
      preview: 'from-slate-800 to-slate-900'
    },
    {
      id: 'night',
      label: 'Night Mode',
      desc: 'Warm toned low-blue-light cinema mode',
      preview: 'from-amber-950 to-slate-900'
    },
    {
      id: 'auto',
      label: 'Auto Theme Switching',
      desc: 'Adapts color profile to local daylight cycles',
      preview: 'from-cyan-700 to-slate-900'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Settings className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                System & Media Preferences
              </h3>
              <p className="text-[11px] text-slate-400">
                ElifAI IPTV Settings Engine • 10-Foot Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Layout: Sidebar + Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Navigation Sidebar */}
          <div className="w-60 bg-slate-900/60 border-r border-slate-800 p-3 space-y-1 overflow-y-auto">
            {[
              { id: 'playback', label: 'Playback & Buffer', icon: <Play className="w-4 h-4" /> },
              { id: 'themes', label: 'Themes & Aesthetics', icon: <Palette className="w-4 h-4 text-cyan-400" /> },
              { id: 'recording', label: 'DVR & Storage', icon: <HardDrive className="w-4 h-4 text-red-400" /> },
              { id: 'ai', label: 'ElifAI Intelligence', icon: <Bot className="w-4 h-4 text-cyan-300" /> },
              { id: 'parental', label: 'Parental Controls', icon: <Lock className="w-4 h-4 text-amber-400" /> },
              { id: 'epg', label: 'EPG XMLTV Guide', icon: <Tv className="w-4 h-4" /> },
              { id: 'backup', label: 'Sync & Backup', icon: <Download className="w-4 h-4" /> },
              { id: 'about', label: 'Compliance & About', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  activeSection === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Configuration Body */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
            {activeSection === 'playback' && (
              <div className="space-y-5">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Play className="w-4 h-4 text-cyan-400" /> Media3 ExoPlayer Engine Tuning
                </h4>

                {/* Buffer Tuning */}
                <div className="space-y-2 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <label className="text-xs font-bold text-slate-200 block">Buffer Cache Tuning</label>
                  <p className="text-[11px] text-slate-400">
                    Control memory pre-fetch buffer to eliminate stuttering on erratic network connections.
                  </p>
                  <div className="grid grid-cols-3 gap-2 pt-2">
                    {[
                      { id: 'standard', title: 'Standard (2s)', desc: 'Lowest latency, high speed fiber' },
                      { id: 'large', title: 'Large (10s)', desc: 'Recommended for Wi-Fi & 4K streams' },
                      { id: 'extreme', title: 'Extreme (25s)', desc: 'Immune to packet loss and jitter' }
                    ].map((b) => (
                      <button
                        key={b.id}
                        onClick={() => onUpdateSettings({ bufferTuning: b.id as any })}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          settings.bufferTuning === b.id
                            ? 'bg-cyan-950/60 border-cyan-400 text-white ring-1 ring-cyan-400'
                            : 'bg-slate-950 border-slate-800 hover:border-slate-700 text-slate-400'
                        }`}
                      >
                        <div className="font-bold text-xs">{b.title}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{b.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hardware Acceleration & Audio */}
                <div className="space-y-3 p-4 rounded-2xl bg-slate-900 border border-slate-800">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-slate-200">Hardware Decoding (MediaCodec Tunneling)</div>
                      <div className="text-[11px] text-slate-400">Offload H.264, H.265, and VP9 to GPU/VPU hardware</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.hardwareDecoding}
                      onChange={(e) => onUpdateSettings({ hardwareDecoding: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">Audio Passthrough (Dolby / DTS-HD)</div>
                      <div className="text-[11px] text-slate-400">Direct bitstream output to AV Receiver over HDMI ARC/eARC</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.audioPassthrough}
                      onChange={(e) => onUpdateSettings({ audioPassthrough: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                    <div>
                      <div className="font-bold text-slate-200">Last Channel Recall (Back Button)</div>
                      <div className="text-[11px] text-slate-400">Return to previous channel with single TV remote Back press</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.lastChannelReturn}
                      onChange={(e) => onUpdateSettings({ lastChannelReturn: e.target.checked })}
                      className="w-4 h-4 accent-cyan-400 rounded"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'themes' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Palette className="w-4 h-4 text-cyan-400" /> UI Aesthetic Profiles
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {themes.map((th) => (
                    <button
                      key={th.id}
                      onClick={() => onUpdateSettings({ theme: th.id })}
                      className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                        settings.theme === th.id
                          ? 'bg-cyan-950/40 border-cyan-400 ring-1 ring-cyan-400'
                          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${th.preview} shrink-0 mt-0.5 shadow-md`} />
                      <div>
                        <div className="font-bold text-slate-100 flex items-center gap-2">
                          <span>{th.label}</span>
                          {settings.theme === th.id && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                          )}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-1">{th.desc}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'recording' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <HardDrive className="w-4 h-4 text-red-400" /> DVR Storage Destination
                </h4>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onUpdateSettings({ storageLocation: 'internal' })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      settings.storageLocation === 'internal'
                        ? 'bg-red-950/40 border-red-400 ring-1 ring-red-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-white">Internal TV Storage</div>
                    <div className="text-[10px] text-slate-400 mt-1">/storage/emulated/0/ElifAI_IPTV/ (18.4 GB Free)</div>
                  </button>

                  <button
                    onClick={() => onUpdateSettings({ storageLocation: 'usb' })}
                    className={`p-4 rounded-2xl border text-left transition-all ${
                      settings.storageLocation === 'usb'
                        ? 'bg-red-950/40 border-red-400 ring-1 ring-red-400'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <div className="font-bold text-white">External USB Hard Drive</div>
                    <div className="text-[10px] text-slate-400 mt-1">/mnt/media_rw/USB_DRIVE_A1/ (930.2 GB Free)</div>
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'ai' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" /> ElifAI Free-Tier Architecture
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="text-xs text-slate-300">
                    The AI Assistant implements an intelligent four-tier fallback sequence:
                  </div>
                  <ol className="list-decimal pl-5 space-y-2 text-[11px] text-slate-400">
                    <li><strong className="text-cyan-300">OpenRouter Free Models:</strong> Zero-cost open community models.</li>
                    <li><strong className="text-cyan-300">Google Gemini Free API (gemini-3.8-flash):</strong> High-throughput server-side proxy.</li>
                    <li><strong className="text-cyan-300">Ollama Local Instance:</strong> On-device local LLM execution.</li>
                    <li><strong className="text-cyan-300">Offline FAQ Knowledge Base:</strong> Instant rule-based support with no internet.</li>
                  </ol>
                  <div className="pt-2">
                    <span className="text-[10px] px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold">
                      SYSTEM STATUS: ALL TIERS RESPONSIVE
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'parental' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-400" /> Parental Control & 4-Digit Security PIN
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white">Adult Category Lock</div>
                      <div className="text-[10px] text-slate-400">Hide 18+ and sensitive content without PIN</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.adultLocked}
                      onChange={(e) => onUpdateSettings({ adultLocked: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-800">
                    <div>
                      <div className="font-bold text-white">Safe Kids Mode</div>
                      <div className="text-[10px] text-slate-400">Restricts library solely to animation & family channels</div>
                    </div>
                    <input
                      type="checkbox"
                      checked={settings.safeMode}
                      onChange={(e) => onUpdateSettings({ safeMode: e.target.checked })}
                      className="w-4 h-4 accent-amber-400 rounded"
                    />
                  </div>

                  <div className="pt-3 border-t border-slate-800">
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Set 4-Digit Parental PIN</label>
                    <div className="flex items-center gap-3">
                      <input
                        type="password"
                        maxLength={4}
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        className="w-32 px-3 py-2 text-center tracking-widest text-base font-mono rounded-xl bg-slate-950 border border-slate-800 text-white focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => {
                          onUpdateSettings({ parentalPin: pinInput });
                          setPinSuccess(true);
                          setTimeout(() => setPinSuccess(false), 2500);
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 font-bold"
                      >
                        {pinSuccess ? 'Saved!' : 'Update PIN'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'epg' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" /> XMLTV Guide Configuration
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Manual XMLTV EPG URL</label>
                    <input
                      type="url"
                      value={settings.manualEpgUrl}
                      onChange={(e) => onUpdateSettings({ manualEpgUrl: e.target.value })}
                      placeholder="https://example.com/epg.xml.gz"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-300 block mb-1">Automatic Refresh Interval</label>
                    <select
                      value={settings.autoEpgRefreshHours}
                      onChange={(e) => onUpdateSettings({ autoEpgRefreshHours: parseInt(e.target.value, 10) })}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400"
                    >
                      <option value={6}>Every 6 Hours</option>
                      <option value={12}>Every 12 Hours (Recommended)</option>
                      <option value={24}>Every 24 Hours</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'backup' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-cyan-400" /> Cloud & Local Backup
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <p className="text-xs text-slate-300">
                    Safeguard your customized playlists, favorites, and buffer preferences into a single portable JSON file.
                  </p>
                  <button
                    onClick={onExportBackup}
                    className="mt-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs"
                  >
                    Export Backup File
                  </button>
                </div>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" /> Legal Compliance & Attribution
                </h4>
                <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="space-y-1">
                    <div className="text-base font-bold text-white">ElifAI IPTV</div>
                    <div className="text-xs text-cyan-400 font-medium">Powered by ElifAI • Created by Ahmad Bilal</div>
                    <div className="text-[11px] text-slate-400">Copyright &copy; 2026. All rights reserved.</div>
                  </div>

                  <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs leading-relaxed">
                    &ldquo;ElifAI IPTV does not provide, host, sell, distribute, or create any TV channels, movies, series, or media content. Users are solely responsible for the content and IPTV services they connect to.&rdquo;
                  </div>

                  <button
                    onClick={onOpenLegal}
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    View Terms of Service, Privacy Policy & DMCA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
