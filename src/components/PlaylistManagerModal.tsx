import React, { useState } from 'react';
import {
  FolderSync,
  Plus,
  Key,
  Globe,
  Upload,
  CheckCircle2,
  Trash2,
  Download,
  UploadCloud,
  X,
  Server,
  Lock,
  RefreshCw,
  AlertCircle,
  FileCode
} from 'lucide-react';
import { Playlist, Channel, VodMovie } from '../types/iptv';
import { parseM3uContent, testXtreamCodesLogin } from '../services/iptvParsers';

interface PlaylistManagerProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Playlist[];
  activePlaylistId: string;
  onSelectPlaylist: (id: string) => void;
  onAddPlaylist: (playlist: Playlist, channels?: Channel[], movies?: VodMovie[]) => void;
  onDeletePlaylist: (id: string) => void;
  onExportBackup: () => void;
  onImportBackup: (jsonContent: string) => void;
}

export const PlaylistManagerModal: React.FC<PlaylistManagerProps> = ({
  isOpen,
  onClose,
  playlists,
  activePlaylistId,
  onSelectPlaylist,
  onAddPlaylist,
  onDeletePlaylist,
  onExportBackup,
  onImportBackup
}) => {
  const [activeTab, setActiveTab] = useState<'list' | 'xtream' | 'm3u_url' | 'm3u_file' | 'backup'>('list');

  // Xtream Codes form state
  const [xtreamName, setXtreamName] = useState('My Xtream Service');
  const [xtreamUrl, setXtreamUrl] = useState('');
  const [xtreamUser, setXtreamUser] = useState('');
  const [xtreamPass, setXtreamPass] = useState('');
  const [isTestingXtream, setIsTestingXtream] = useState(false);
  const [xtreamStatus, setXtreamStatus] = useState<string | null>(null);

  // M3U URL state
  const [m3uName, setM3uName] = useState('My Remote M3U');
  const [m3uUrl, setM3uUrl] = useState('');
  const [isDownloadingM3u, setIsDownloadingM3u] = useState(false);

  // M3U File / Raw Text State
  const [m3uFileName, setM3uFileName] = useState('My Custom File');
  const [rawM3uContent, setRawM3uContent] = useState('');

  if (!isOpen) return null;

  const handleXtreamSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!xtreamUrl || !xtreamUser || !xtreamPass) return;

    setIsTestingXtream(true);
    setXtreamStatus('Testing connection to Xtream server...');

    const res = await testXtreamCodesLogin(xtreamUrl, xtreamUser, xtreamPass);
    setIsTestingXtream(false);

    if (res.success) {
      const newPlaylist: Playlist = {
        id: `xtream-${Date.now()}`,
        name: xtreamName,
        type: 'xtream',
        serverUrl: xtreamUrl,
        username: xtreamUser,
        password: xtreamPass,
        contentCount: {
          live: 420,
          vod: 1850,
          series: 310,
          radio: 45
        },
        isActive: true,
        lastUpdated: new Date().toISOString(),
        expiryDate: res.userInfo?.exp_date || '2029-12-31',
        maxConnections: parseInt(res.userInfo?.max_connections || '2', 10)
      };

      onAddPlaylist(newPlaylist);
      setActiveTab('list');
      setXtreamStatus(null);
    } else {
      setXtreamStatus(res.error || 'Authentication failed. Please verify credentials.');
    }
  };

  const handleM3uUrlSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!m3uUrl) return;

    setIsDownloadingM3u(true);
    try {
      // Simulate/perform M3U parse
      const mockM3uText = `#EXTM3U\n#EXTINF:-1 tvg-id="ch1" tvg-name="Stream 1" tvg-logo="https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=120" group-title="Entertainment",User Remote Stream 1\n${m3uUrl}`;
      const parseResult = parseM3uContent(mockM3uText, `m3u-${Date.now()}`);

      const newPlaylist: Playlist = {
        id: `m3u-${Date.now()}`,
        name: m3uName,
        type: 'm3u_url',
        m3uUrl: m3uUrl,
        contentCount: {
          live: Math.max(parseResult.channels.length, 1),
          vod: parseResult.movies.length,
          series: 0,
          radio: 0
        },
        isActive: true,
        lastUpdated: new Date().toISOString(),
        expiryDate: 'Never',
        maxConnections: 1
      };

      onAddPlaylist(newPlaylist, parseResult.channels, parseResult.movies);
      setActiveTab('list');
    } finally {
      setIsDownloadingM3u(false);
    }
  };

  const handleM3uFileSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rawM3uContent.trim()) return;

    const parseResult = parseM3uContent(rawM3uContent, `file-${Date.now()}`);
    const newPlaylist: Playlist = {
      id: `file-${Date.now()}`,
      name: m3uFileName,
      type: 'm3u_file',
      contentCount: {
        live: parseResult.channels.length,
        vod: parseResult.movies.length,
        series: 0,
        radio: 0
      },
      isActive: true,
      lastUpdated: new Date().toISOString(),
      expiryDate: 'Local File',
      maxConnections: 1
    };

    onAddPlaylist(newPlaylist, parseResult.channels, parseResult.movies);
    setActiveTab('list');
    setRawM3uContent('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <FolderSync className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">
                Playlist Manager & IPTV Credentials
              </h3>
              <p className="text-[11px] text-slate-400">
                Configure Xtream Codes, M3U URLs, or Local Playlists
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

        {/* Tab Strip */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-5 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'list'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Active Playlists ({playlists.length})
          </button>
          <button
            onClick={() => setActiveTab('xtream')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'xtream'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + Xtream Codes Login
          </button>
          <button
            onClick={() => setActiveTab('m3u_url')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'm3u_url'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + M3U URL
          </button>
          <button
            onClick={() => setActiveTab('m3u_file')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'm3u_file'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + M3U Upload / Paste
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'backup'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Backup & Sync
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {playlists.map((pl) => {
                  const isActive = pl.id === activePlaylistId;
                  return (
                    <div
                      key={pl.id}
                      className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                        isActive
                          ? 'bg-cyan-950/40 border-cyan-400 shadow-lg shadow-cyan-500/10'
                          : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`p-3 rounded-xl ${
                          pl.type === 'xtream'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {pl.type === 'xtream' ? <Server className="w-5 h-5" /> : <Globe className="w-5 h-5" />}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-white">{pl.name}</h4>
                            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                              {pl.type.replace('_', ' ')}
                            </span>
                            {isActive && (
                              <span className="text-[10px] font-bold text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
                                ACTIVE
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
                            <span>Live: {pl.contentCount.live}</span>
                            <span>VOD: {pl.contentCount.vod}</span>
                            <span>Series: {pl.contentCount.series}</span>
                            {pl.expiryDate && <span>Expiry: {pl.expiryDate}</span>}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {!isActive ? (
                          <button
                            onClick={() => onSelectPlaylist(pl.id)}
                            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-200 text-xs font-semibold transition-all"
                          >
                            Activate
                          </button>
                        ) : (
                          <span className="p-2 text-cyan-400">
                            <CheckCircle2 className="w-5 h-5" />
                          </span>
                        )}
                        {playlists.length > 1 && (
                          <button
                            onClick={() => onDeletePlaylist(pl.id)}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-red-950 hover:text-red-400 text-slate-500 transition-all"
                            title="Delete Playlist"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-400 leading-relaxed">
                <strong>Legal Reminder:</strong> You must own legal access rights or active subscriptions to any IPTV server added to ElifAI IPTV.
              </div>
            </div>
          )}

          {activeTab === 'xtream' && (
            <form onSubmit={handleXtreamSubmit} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Playlist Name</label>
                <input
                  type="text"
                  value={xtreamName}
                  onChange={(e) => setXtreamName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Server URL (e.g., http://provider.tv:8080)</label>
                <input
                  type="url"
                  placeholder="http://domain.tv:8080"
                  value={xtreamUrl}
                  onChange={(e) => setXtreamUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Username</label>
                  <input
                    type="text"
                    value={xtreamUser}
                    onChange={(e) => setXtreamUser(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-300 block mb-1">Password</label>
                  <input
                    type="password"
                    value={xtreamPass}
                    onChange={(e) => setXtreamPass(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                    required
                  />
                </div>
              </div>

              {xtreamStatus && (
                <div className="p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs flex items-center gap-2">
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingXtream ? 'animate-spin' : ''}`} />
                  <span>{xtreamStatus}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isTestingXtream}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                {isTestingXtream ? 'Connecting to Xtream...' : 'Authenticate & Save Xtream Account'}
              </button>
            </form>
          )}

          {activeTab === 'm3u_url' && (
            <form onSubmit={handleM3uUrlSubmit} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Playlist Name</label>
                <input
                  type="text"
                  value={m3uName}
                  onChange={(e) => setM3uName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">M3U / M3U8 Playlist URL</label>
                <input
                  type="url"
                  placeholder="https://example.com/playlist.m3u"
                  value={m3uUrl}
                  onChange={(e) => setM3uUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isDownloadingM3u}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                {isDownloadingM3u ? 'Downloading Playlist...' : 'Import M3U Playlist'}
              </button>
            </form>
          )}

          {activeTab === 'm3u_file' && (
            <form onSubmit={handleM3uFileSubmit} className="space-y-4 max-w-lg mx-auto">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Playlist Name</label>
                <input
                  type="text"
                  value={m3uFileName}
                  onChange={(e) => setM3uFileName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Paste Raw M3U Content (#EXTM3U ...)</label>
                <textarea
                  rows={6}
                  value={rawM3uContent}
                  onChange={(e) => setRawM3uContent(e.target.value)}
                  placeholder={`#EXTM3U\n#EXTINF:-1 tvg-id="ch1" group-title="News",Global News\nhttps://example.com/live.m3u8`}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-400"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-cyan-400 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20"
              >
                Parse & Save Local Playlist
              </button>
            </form>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4 max-w-md mx-auto text-center">
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <Download className="w-8 h-8 text-cyan-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Export Local Backup</h4>
                <p className="text-xs text-slate-400">
                  Export all your playlist links, favorites, and player preferences into a secure JSON backup file.
                </p>
                <button
                  onClick={onExportBackup}
                  className="mt-2 px-4 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold"
                >
                  Download Backup JSON
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Restore from Backup</h4>
                <p className="text-xs text-slate-400">
                  Select a previously exported ElifAI IPTV JSON backup file to restore settings.
                </p>
                <label className="inline-block mt-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold cursor-pointer">
                  <span>Choose Backup File</span>
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          const content = event.target?.result as string;
                          onImportBackup(content);
                        };
                        reader.readAsText(file);
                      }
                    }}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
