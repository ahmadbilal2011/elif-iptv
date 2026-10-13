import React, { useState } from 'react';
import {
  Code2,
  Folder,
  FileCode,
  Copy,
  Check,
  Download,
  Terminal,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
  Search
} from 'lucide-react';
import { ANDROID_STUDIO_PROJECT_FILES, AndroidSourceFile } from '../data/androidSourceCode';

export const AndroidCodebaseViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<AndroidSourceFile>(
    ANDROID_STUDIO_PROJECT_FILES[0]
  );
  const [copied, setCopied] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadAll = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(
      JSON.stringify(ANDROID_STUDIO_PROJECT_FILES, null, 2)
    );
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'ElifAI_IPTV_Android_Studio_Source_v2.5.0.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const filteredFiles = ANDROID_STUDIO_PROJECT_FILES.filter(f =>
    f.path.toLowerCase().includes(searchFilter.toLowerCase()) ||
    f.category.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full p-6 space-y-6 animate-fadeIn pb-16">
      {/* Top Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-emerald-500/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-md">
            <Code2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-wide">
                Android Studio Source Code Architecture
              </h2>
              <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-500/40">
                KOTLIN + JETPACK COMPOSE FOR TV
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Production-ready Media3 / ExoPlayer • Room Database • Clean Architecture • MVVM • Hilt
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs shadow-lg hover:from-emerald-400 hover:to-teal-500 transition-all active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Download Full Project (JSON)</span>
          </button>
        </div>
      </div>

      {/* Main Split Screen: File Explorer & Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[72vh]">
        {/* Left: Project File Tree */}
        <div className="lg:col-span-4 bg-slate-950/80 border border-slate-800 rounded-3xl p-4 flex flex-col space-y-3 overflow-hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search source files..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between px-1">
            <span>Project Files ({filteredFiles.length})</span>
            <span className="text-emerald-400 font-mono">ai.elif.iptv</span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {filteredFiles.map((file) => {
              const isSelected = selectedFile.path === file.path;
              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full text-left p-2.5 rounded-xl text-xs font-mono transition-all flex items-center justify-between gap-2 ${
                    isSelected
                      ? 'bg-emerald-950/60 border border-emerald-400 text-emerald-300 shadow-md ring-1 ring-emerald-400/40'
                      : 'bg-slate-900/50 hover:bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-4 h-4 shrink-0 text-emerald-400" />
                    <span className="truncate">{file.path}</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 uppercase font-sans shrink-0">
                    {file.category}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick build instructions pill */}
          <div className="p-3 rounded-2xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Release Build Command:
            </div>
            <code className="block p-1.5 rounded bg-black/60 font-mono text-[10px] text-emerald-300">
              ./gradlew assembleRelease
            </code>
          </div>
        </div>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 bg-slate-950/90 border border-slate-800 rounded-3xl flex flex-col overflow-hidden shadow-2xl">
          {/* File Tab Header */}
          <div className="p-4 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <FileCode className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="font-mono text-xs font-bold text-white truncate">
                {selectedFile.path}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/40 uppercase">
                {selectedFile.language}
              </span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-all shrink-0"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Code'}</span>
            </button>
          </div>

          {/* Code Text Area */}
          <div className="flex-1 p-4 overflow-y-auto bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed">
            <pre className="whitespace-pre-wrap">{selectedFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
