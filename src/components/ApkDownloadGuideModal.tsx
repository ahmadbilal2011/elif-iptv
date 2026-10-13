import React, { useState } from 'react';
import {
  Download,
  Tv,
  Key,
  Server,
  Usb,
  Terminal,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  ExternalLink,
  X,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe,
  Lock,
  Cpu
} from 'lucide-react';

interface ApkGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenXtreamLogin: () => void;
}

export const ApkDownloadGuideModal: React.FC<ApkGuideModalProps> = ({
  isOpen,
  onClose,
  onOpenXtreamLogin
}) => {
  const [activeTab, setActiveTab] = useState<'download' | 'login_guide' | 'usb_adb' | 'troubleshooting'>('download');
  const [copiedUrl, setCopiedUrl] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : '';
  const downloadUrl = `${currentOrigin}/download/elifai-iptv.apk`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(downloadUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl rounded-3xl bg-slate-950 border border-cyan-500/40 shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
              <Download className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-white tracking-wide">
                  ElifAI IPTV — Android TV Installation & Setup
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono font-bold border border-emerald-500/30">
                  v2.5.0 STABLE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Official Release APK & End-User Xtream Codes Login Manual
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

        {/* Tab Selector */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 pt-2 text-xs">
          <button
            onClick={() => setActiveTab('download')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'download'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>1. Download APK & TV Setup</span>
          </button>
          <button
            onClick={() => setActiveTab('login_guide')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'login_guide'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Key className="w-3.5 h-3.5" />
            <span>2. End-User Xtream Login Guide</span>
          </button>
          <button
            onClick={() => setActiveTab('usb_adb')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'usb_adb'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Usb className="w-3.5 h-3.5" />
            <span>3. USB Flash & ADB Install</span>
          </button>
          <button
            onClick={() => setActiveTab('troubleshooting')}
            className={`px-4 py-2.5 font-bold rounded-t-xl transition-all flex items-center gap-2 ${
              activeTab === 'troubleshooting'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>4. Login Diagnostics</span>
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-xs text-slate-300">
          {/* TAB 1: DOWNLOAD & TV SETUP */}
          {activeTab === 'download' && (
            <div className="space-y-6">
              {/* Primary Download Action Card */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-slate-950 border border-cyan-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-white text-base font-bold">ElifAI-IPTV-v2.5.0-release.apk</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono text-[10px] font-bold border border-emerald-500/30">
                      100% OFFLINE UI EMBEDDED
                    </span>
                    <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[10px]">
                      ARMv7 (32-bit) / ARM64 (64-bit)
                    </span>
                  </div>
                  <p className="text-slate-400 text-xs max-w-xl">
                    Engineered for <strong>Xiaomi Mi TV Stick</strong>, Mi Box, Android TV, Google TV, Fire TV, and Nvidia Shield. Bundles its complete 10-foot TV UI locally in <code className="text-cyan-300 font-mono">assets/www/</code> so it loads and operates without requiring an external internet server!
                  </p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-slate-400 font-mono pt-1">
                    <span>Package: <strong className="text-slate-200">ai.elif.iptv</strong></span>
                    <span>•</span>
                    <span>Android Version: <strong className="text-emerald-400">Android 10+ (minSdk 21 to 35)</strong></span>
                    <span>•</span>
                    <span>Size: <strong className="text-cyan-300">~1.3 MB (Ultra-Lightweight)</strong></span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0">
                  <a
                    href="/download/elifai-iptv.apk"
                    download="ElifAI-IPTV-v2.5.0-release.apk"
                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-500 text-slate-950 font-bold text-xs uppercase tracking-wider hover:from-emerald-300 hover:to-blue-400 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all text-center"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Offline APK</span>
                  </a>
                </div>
              </div>

              {/* Special Xiaomi Mi TV Stick Card */}
              <div className="p-4 rounded-2xl bg-amber-950/30 border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                  <span>Important for Xiaomi Mi TV Stick (Android 9 / 10 / 11) Users:</span>
                </div>
                <div className="text-[11px] text-slate-300 space-y-1.5 pl-6">
                  <div>• <strong>Fixed Parse Error (&ldquo;Problem parsing the package&rdquo;):</strong> The APK is compiled with binary AXML and <code className="text-cyan-300 font-mono">minSdkVersion 21</code>, resolving Android 10 package parsing conflicts.</div>
                  <div>• <strong>Google Play Protect Warning:</strong> If Mi TV Stick says &ldquo;Blocked by Play Protect&rdquo;, tap <em>&ldquo;Install anyway&rdquo;</em> (or in Google Play Store &gt; Profile &gt; Play Protect &gt; Settings gear &gt; Turn OFF &ldquo;Scan apps with Play Protect&rdquo;).</div>
                  <div>• <strong>1GB RAM Memory Tuning:</strong> Hardware decoding (MediaCodec) is active by default with zero memory leak, so playback remains buttery-smooth on 1080p sticks.</div>
                </div>
              </div>

              {/* Direct Link & Downloader App URL Box */}
              <div className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                <label className="text-xs font-bold text-slate-200 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-cyan-400" />
                    Direct APK URL for TV &ldquo;Downloader&rdquo; App:
                  </span>
                  <span className="text-[10px] text-slate-400">Type this URL into Downloader on your TV</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={downloadUrl}
                    className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyUrl}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all shrink-0"
                  >
                    {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedUrl ? 'Copied' : 'Copy URL'}</span>
                  </button>
                </div>
              </div>

              {/* Step-by-Step TV Installation Walkthrough */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cyan-400" /> Method 1: Install using the &ldquo;Downloader&rdquo; App on TV (Recommended)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <h5 className="font-bold text-white">Get Downloader App</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      On your TV, open <strong>Google Play Store</strong> (or Amazon Appstore) and search for <strong>&ldquo;Downloader by AFTVnews&rdquo;</strong>. Install and open it.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                      2
                    </div>
                    <h5 className="font-bold text-white">Enable Unknown Apps</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Go to TV <strong>Settings &gt; Apps &gt; Special app access &gt; Install unknown apps</strong> (or Security &amp; Restrictions) and toggle <strong>ON</strong> for Downloader.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                    <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 font-bold flex items-center justify-center text-xs">
                      3
                    </div>
                    <h5 className="font-bold text-white">Enter URL &amp; Install</h5>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      In Downloader, enter the direct URL above, click <strong>GO</strong>. When the download finishes, select <strong>INSTALL</strong> and launch ElifAI IPTV!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: END-USER XTREAM LOGIN GUIDE */}
          {activeTab === 'login_guide' && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex items-start gap-3">
                <Key className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-white text-sm">How End Users Connect Their IPTV Service</h4>
                  <p className="text-slate-400 text-xs mt-1">
                    ElifAI IPTV is an empty player. End users enter the Xtream Codes credentials provided by their IPTV service provider. Here is the exact walkthrough:
                  </p>
                </div>
              </div>

              {/* Visual Step-by-Step Demonstration */}
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">1</span>
                    <h5 className="font-bold text-white text-sm">Launch ElifAI IPTV &amp; Accept Notice</h5>
                  </div>
                  <p className="text-slate-400 text-xs pl-8">
                    When the app launches for the first time, it displays the legal regulatory notice confirming that ElifAI IPTV is player software. Click <strong>&ldquo;I Agree &amp; Enter ElifAI IPTV&rdquo;</strong>.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">2</span>
                    <h5 className="font-bold text-white text-sm">Open Xtream Codes Login</h5>
                  </div>
                  <p className="text-slate-400 text-xs pl-8">
                    Click the <strong>&ldquo;Manage Playlists&rdquo;</strong> button on the top TV bar (or navigate to Settings &gt; Playlists), then select <strong>&ldquo;+ Xtream Codes Login&rdquo;</strong>.
                  </p>
                </div>

                {/* Simulated Credential Entry Form Box */}
                <div className="p-5 rounded-2xl bg-slate-950 border border-cyan-500/30 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center text-xs">3</span>
                      <h5 className="font-bold text-white text-sm">Enter Xtream Credentials:</h5>
                    </div>
                    <span className="text-[10px] text-cyan-400 font-mono">FIELD SPECIFICATIONS</span>
                  </div>

                  <div className="space-y-3 pl-2">
                    {/* 1. Playlist Name */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>A. Playlist Name</span>
                        <span className="text-[10px] text-slate-500">(Any friendly label)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Example: <code className="text-cyan-300 font-mono">My Home IPTV</code> or <code className="text-cyan-300 font-mono">Living Room Subscription</code>
                      </div>
                    </div>

                    {/* 2. Server URL */}
                    <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                      <div className="font-bold text-white flex items-center gap-2">
                        <span>B. Server URL</span>
                        <span className="text-[10px] text-amber-400 font-semibold">(CRITICAL FORMATTING)</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-1">
                        Enter the server host and port as given by your provider:
                      </div>
                      <div className="p-2 rounded-lg bg-black/50 text-cyan-300 font-mono text-[11px] mt-1.5 flex items-center justify-between">
                        <span>http://provider-domain.tv:8080</span>
                        <span className="text-emerald-400 text-[10px]">CORRECT</span>
                      </div>
                      <div className="p-2 rounded-lg bg-red-950/30 border border-red-500/30 text-red-300 font-mono text-[10px] mt-1.5 space-y-0.5">
                        <div><strong>DO NOT:</strong> Include trailing slash (e.g., <code>...:8080/</code> is incorrect)</div>
                        <div><strong>DO NOT:</strong> Include script paths (e.g., <code>.../get.php</code> or <code>.../player_api.php</code> is incorrect)</div>
                      </div>
                    </div>

                    {/* 3. Username & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="font-bold text-white">C. Username</div>
                        <div className="text-[11px] text-slate-400 mt-1">Case-sensitive account ID</div>
                        <code className="block mt-1 text-cyan-300 font-mono text-[11px]">user92847</code>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <div className="font-bold text-white">D. Password</div>
                        <div className="text-[11px] text-slate-400 mt-1">Case-sensitive account password</div>
                        <code className="block mt-1 text-cyan-300 font-mono text-[11px]">pass_secure123</code>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 pl-2 flex items-center justify-between">
                    <p className="text-[11px] text-slate-400">
                      Click <strong>&ldquo;Authenticate &amp; Save Xtream Account&rdquo;</strong>.
                    </p>
                    <button
                      onClick={onOpenXtreamLogin}
                      className="px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 shadow-md text-xs"
                    >
                      Open Xtream Login Dialog Now &rarr;
                    </button>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-bold flex items-center justify-center text-xs">4</span>
                    <h5 className="font-bold text-white text-sm">Automated Library Synchronization</h5>
                  </div>
                  <p className="text-slate-400 text-xs pl-8">
                    ElifAI IPTV instantly connects to the server and populates:
                  </p>
                  <ul className="list-disc pl-12 text-slate-300 text-xs space-y-1">
                    <li><strong>Live TV:</strong> Organized by bouquets (Sports, News, Cinema, Documentary).</li>
                    <li><strong>Movies (VOD):</strong> High-resolution posters, ratings, synopsis, and cast.</li>
                    <li><strong>TV Series:</strong> Structured by Seasons and Episodes.</li>
                    <li><strong>XMLTV EPG:</strong> Real-time electronic program guide and schedule.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: USB & ADB INSTALL */}
          {activeTab === 'usb_adb' && (
            <div className="space-y-6">
              {/* Method 2: USB Drive */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Usb className="w-4 h-4 text-cyan-400" /> Method 2: Sideload via USB Flash Drive
                </h4>
                <ol className="list-decimal pl-5 space-y-2 text-slate-300 text-xs">
                  <li>
                    Click the <strong>&ldquo;Download Release APK&rdquo;</strong> button to save <code className="text-cyan-300 font-mono">ElifAI-IPTV-v2.5.0-release.apk</code> onto your computer.
                  </li>
                  <li>
                    Copy the APK file onto a USB thumb drive formatted in <strong>FAT32</strong> or <strong>exFAT</strong>.
                  </li>
                  <li>
                    Insert the USB drive into your Android TV or Nvidia Shield USB port.
                  </li>
                  <li>
                    On the TV, open any File Manager (such as <strong>File Commander</strong>, <strong>FX File Explorer</strong>, or <strong>X-plore</strong>).
                  </li>
                  <li>
                    Browse to the USB drive, click <code className="text-cyan-300 font-mono">ElifAI-IPTV-v2.5.0-release.apk</code>, and click <strong>Install</strong>.
                  </li>
                </ol>
              </div>

              {/* Method 3: ADB Command Line */}
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-400" /> Method 3: Wireless ADB Command Line (Power Users)
                </h4>
                <p className="text-slate-400 text-xs">
                  If you have Developer Options and Network Debugging enabled on your Android TV:
                </p>

                <div className="space-y-2 pt-1 font-mono text-[11px]">
                  <div className="p-3 rounded-xl bg-black/70 text-slate-200 border border-slate-800">
                    <span className="text-slate-500"># 1. Connect to Android TV IP Address</span><br />
                    <span className="text-emerald-400">adb connect</span> <span className="text-cyan-300">192.168.1.150:5555</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/70 text-slate-200 border border-slate-800">
                    <span className="text-slate-500"># 2. Install Release APK directly onto the TV</span><br />
                    <span className="text-emerald-400">adb install -r</span> <span className="text-cyan-300">ElifAI-IPTV-v2.5.0-release.apk</span>
                  </div>
                  <div className="p-3 rounded-xl bg-black/70 text-slate-200 border border-slate-800">
                    <span className="text-slate-500"># 3. Launch Leanback Main Activity</span><br />
                    <span className="text-emerald-400">adb shell monkey -p</span> <span className="text-cyan-300">ai.elif.iptv -c android.intent.category.LEANBACK_LAUNCHER 1</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TROUBLESHOOTING */}
          {activeTab === 'troubleshooting' && (
            <div className="space-y-4">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" /> Common Xtream Codes Login Issues &amp; Fixes
              </h4>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h5 className="font-bold text-amber-300 text-xs">1. Error 401 / 403 Forbidden</h5>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Cause:</strong> Typo in username/password, or the subscription has expired, or the IPTV provider locks access to a specific MAC address.
                    <br /><strong>Fix:</strong> Double-check letter case (usernames are case-sensitive). Ask your provider if your account has an active expiration date.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h5 className="font-bold text-amber-300 text-xs">2. &ldquo;Could not resolve host / Connection timed out&rdquo;</h5>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Cause:</strong> Your Internet Service Provider (ISP) may be blocking the IPTV domain at the DNS level.
                    <br /><strong>Fix:</strong> In Android TV <strong>Settings &gt; Network &gt; IP Settings</strong>, switch DNS to Cloudflare (<code className="text-cyan-300 font-mono">1.1.1.1</code>) or Google (<code className="text-cyan-300 font-mono">8.8.8.8</code>).
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h5 className="font-bold text-amber-300 text-xs">3. Protocol Mismatch (HTTP vs HTTPS)</h5>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Cause:</strong> Most IPTV servers do NOT have valid SSL certificates on their streaming ports.
                    <br /><strong>Fix:</strong> If your provider gave you <code className="text-cyan-300 font-mono">http://server:8080</code>, do NOT change it to <code className="text-cyan-300 font-mono">https://</code>.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
                  <h5 className="font-bold text-amber-300 text-xs">4. Maximum Concurrent Connections Exceeded</h5>
                  <p className="text-slate-400 text-[11px]">
                    <strong>Cause:</strong> If your subscription allows only 1 connection, streaming on a smartphone or second TV will cause the first stream to be terminated.
                    <br /><strong>Fix:</strong> Stop playback on other devices before streaming on ElifAI IPTV.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>ElifAI IPTV • Powered by ElifAI • Created by Ahmad Bilal</span>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="/download/elifai-iptv.apk"
              download="ElifAI-IPTV-v2.5.0-release.apk"
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download APK File</span>
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all"
            >
              Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
