import React, { useState } from 'react';
import { ShieldCheck, AlertTriangle, FileText, CheckCircle2, Lock, Scale } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onAccept: () => void;
  canDismiss?: boolean;
}

export const LegalOnboardingModal: React.FC<LegalModalProps> = ({
  isOpen,
  onAccept,
  canDismiss = false
}) => {
  const [activeTab, setActiveTab] = useState<'notice' | 'terms' | 'privacy' | 'dmca'>('notice');
  const [acknowledged, setAcknowledged] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-950 border border-cyan-500/40 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-slate-900 via-slate-950 to-slate-900 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-wide flex items-center gap-2">
                ElifAI IPTV <span className="text-xs px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono">LEGAL COMPLIANCE</span>
              </h2>
              <p className="text-xs text-slate-400">
                ElifAI IPTV - Powered by ElifAI • Created by Ahmad Bilal
              </p>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              <Lock className="w-3 h-3" /> Player Client Only
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-slate-900/60 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('notice')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'notice'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Compliance Notice
          </button>
          <button
            onClick={() => setActiveTab('terms')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'terms'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Terms of Service
          </button>
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'privacy'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab('dmca')}
            className={`px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all ${
              activeTab === 'dmca'
                ? 'bg-slate-950 text-cyan-400 border-t-2 border-cyan-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            DMCA Policy
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-sm text-slate-300 leading-relaxed flex-1">
          {activeTab === 'notice' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="font-bold text-amber-300 text-sm">Mandatory Regulatory Notice</h4>
                  <p className="text-xs font-medium leading-relaxed">
                    &ldquo;ElifAI IPTV does not provide, host, sell, distribute, or create any TV channels, movies, series, or media content. Users are solely responsible for the content and IPTV services they connect to.&rdquo;
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300 bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                <h4 className="font-semibold text-white flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                  Application Architectural Boundaries:
                </h4>
                <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
                  <li><strong>Player-Only Utility:</strong> ElifAI IPTV functions strictly as a multimedia reproduction client (comparable to VLC, ExoPlayer, or Kodi).</li>
                  <li><strong>Zero Preloaded Services:</strong> The application does NOT contain pre-configured channels, server lists, or streaming subscriptions.</li>
                  <li><strong>User Credential Obligation:</strong> Users must furnish their own legally obtained Xtream Codes API credentials, M3U URLs, or local playlist files.</li>
                  <li><strong>No DRM Circumvention:</strong> The application does NOT circumvent digital rights management or bypass paywalls.</li>
                  <li><strong>Anti-Piracy Commitment:</strong> Neither ElifAI nor Ahmad Bilal endorses or facilitates unauthorized streaming of copyrighted media.</li>
                </ul>
              </div>

              <div className="text-xs text-slate-400 italic">
                By clicking &ldquo;I Agree & Continue&rdquo;, you confirm that you have legal rights to stream any media URLs you input into this player.
              </div>
            </div>
          )}

          {activeTab === 'terms' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-base font-bold text-white">Terms of Service - ElifAI IPTV</h3>
              <p><strong>1. License Grant:</strong> ElifAI IPTV grants you a personal, revocable, non-exclusive license to use this player software on supported Android TV and Google TV devices.</p>
              <p><strong>2. User Content Responsibility:</strong> You retain complete legal responsibility for all playlists, M3U streams, and EPG sources imported into the app.</p>
              <p><strong>3. Prohibited Uses:</strong> You shall not use this software to infringe upon intellectual property, broadcast unlawful content, or distribute pirated streams.</p>
              <p><strong>4. No Warranty:</strong> The software is provided &ldquo;as is&rdquo;. Playback quality is determined by your third-party stream server and local network performance.</p>
            </div>
          )}

          {activeTab === 'privacy' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-base font-bold text-white">Privacy Policy - ElifAI IPTV</h3>
              <p><strong>1. Zero Data Collection:</strong> ElifAI IPTV does NOT collect, store on external servers, or sell your personal streaming history or IPTV credentials.</p>
              <p><strong>2. Local Storage:</strong> Your playlists, credentials, favorites, and settings are stored locally on your device using encrypted storage.</p>
              <p><strong>3. AI Queries:</strong> Questions asked to ElifAI Assistant are processed securely via configured AI proxy APIs and are never linked to personal identifiers.</p>
              <p><strong>4. Analytics:</strong> No invasive tracking or telemetry SDKs are embedded.</p>
            </div>
          )}

          {activeTab === 'dmca' && (
            <div className="space-y-3 text-xs text-slate-300">
              <h3 className="text-base font-bold text-white">DMCA & Copyright Compliance</h3>
              <p className="flex items-center gap-2 text-cyan-400">
                <Scale className="w-4 h-4" /> Intellectual Property Protection
              </p>
              <p>
                ElifAI IPTV is an empty media player software. It does not store or host any audio-visual materials on its servers. As such, ElifAI IPTV has no ability to remove content hosted on independent third-party servers.
              </p>
              <p>
                Copyright holders seeking removal of infringing streams should contact the specific web host or streaming server operator directly.
              </p>
              <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                <strong>Copyright:</strong> ElifAI IPTV - Powered by ElifAI | Created by Ahmad Bilal. All software rights reserved.
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2.5 text-xs text-slate-300 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-cyan-400 focus:ring-offset-slate-950"
            />
            <span>I acknowledge that ElifAI IPTV is an empty player and agree to the Terms.</span>
          </label>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {canDismiss && (
              <button
                onClick={onAccept}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white hover:bg-slate-900 transition-all"
              >
                Close
              </button>
            )}
            <button
              onClick={onAccept}
              disabled={!acknowledged}
              className={`w-full sm:w-auto px-6 py-2.5 rounded-xl text-xs font-bold tracking-wide uppercase transition-all shadow-lg flex items-center justify-center gap-2 ${
                acknowledged
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 hover:from-cyan-400 hover:to-blue-500 shadow-cyan-500/25 active:scale-95'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              I Agree & Enter ElifAI IPTV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
