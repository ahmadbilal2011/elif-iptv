var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
var import_path = __toESM(require("path"), 1);
var import_fs = __toESM(require("fs"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var port = parseInt(process.env.PORT || "3000", 10);
app.use(import_express.default.json({ limit: "20mb" }));
app.use(import_express.default.urlencoded({ extended: true, limit: "20mb" }));
var OFFLINE_KNOWLEDGE_BASE = [
  {
    keywords: ["buffer", "buffering", "lag", "freeze", "freezing", "stutter"],
    answer: "Buffering troubleshooting for ElifAI IPTV on Android TV:\n1. Open Settings > Playback Settings > Buffer Tuning and switch buffer from 'Standard (2s)' to 'Large (10s)' or 'Extreme (25s)'.\n2. Toggle Hardware Acceleration (MediaCodec) to 'Auto' or try 'Software Fallback' if the MPEG-TS codec struggles.\n3. Change player engine to Media3 / ExoPlayer Tunneling mode.\n4. Ensure 5GHz Wi-Fi or Ethernet connection on your Android TV Box / Nvidia Shield.\n5. Verify your IPTV provider bandwidth limit."
  },
  {
    keywords: ["xtream", "login", "server url", "error 401", "error 403", "authentication"],
    answer: "Xtream Codes connection guide:\n1. Server URL format must be exact, e.g., 'http://provider.tv:8080' (do not include trailing / or /get.php).\n2. Verify username and password (case-sensitive).\n3. Check if your provider has an active expiration date or MAC address lock.\n4. If your ISP blocks IPTV DNS, configure Cloudflare DNS (1.1.1.1) in Android TV network settings."
  },
  {
    keywords: ["epg", "guide", "xmltv", "no program", "schedule"],
    answer: "Electronic Program Guide (EPG) setup:\n1. ElifAI IPTV automatically extracts EPG from Xtream Codes accounts.\n2. For manual M3U, enter the XMLTV URL in Settings > EPG Settings > Manual EPG URL.\n3. Turn on 'Automatic EPG Refresh' (every 12 or 24 hours).\n4. In the Live TV player, press UP/DOWN on your TV Remote D-Pad to open the Grid TV Guide."
  },
  {
    keywords: ["record", "recording", "usb", "schedule record", "dvr"],
    answer: "ElifAI IPTV Recording engine:\n1. Android TV supports both Internal Storage and USB external drives (FAT32/exFAT).\n2. Long-press OK / Select on any channel or EPG program to schedule a background recording.\n3. Access recordings anytime in the 'Recordings Manager' tab on the Home Screen."
  },
  {
    keywords: ["legal", "copyright", "piracy", "dmca", "terms", "safe"],
    answer: "Legal Compliance Notice:\nElifAI IPTV is strictly a media player application created by Ahmad Bilal and powered by ElifAI. It does NOT host, supply, distribute, or curate any streams, channels, or copyrighted materials. Users must supply their own legally obtained IPTV credentials (Xtream Codes or M3U)."
  },
  {
    keywords: ["remote", "dpad", "controller", "navigation", "shortcuts"],
    answer: "Android TV Remote Shortcuts in ElifAI IPTV:\n\u2022 D-Pad UP/DOWN: Quick Channel Switch & EPG mini-bar\n\u2022 D-Pad LEFT: Category & Playlist drawer\n\u2022 D-Pad RIGHT: Audio & Subtitle stream picker\n\u2022 OK / ENTER: Play / Pause & Show OSD Controls\n\u2022 BACK: Exit player / Return to previous channel (Last Channel Return)\n\u2022 YELLOW / MENU button: ElifAI Assistant voice trigger"
  }
];
function getOfflineFallbackAnswer(query) {
  const q = query.toLowerCase();
  for (const item of OFFLINE_KNOWLEDGE_BASE) {
    if (item.keywords.some((k) => q.includes(k))) {
      return item.answer;
    }
  }
  return "ElifAI Assistant (Offline TV Mode):\nI am running in offline mode. I can assist you with Xtream Codes login, M3U playlist importing, EPG configuration, buffer tuning, USB recording, and D-Pad remote navigation. What would you like help with?";
}
app.post("/api/ai/assistant", async (req, res) => {
  const { prompt, context = {}, providerPreference = "auto" } = req.body;
  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Prompt is required" });
  }
  const systemInstruction = `You are "ElifAI Assistant", the built-in AI concierge in ElifAI IPTV.
Product: ElifAI IPTV
Powered by: ElifAI
Created by: Ahmad Bilal
Target Platform: Android TV, Google TV, Nvidia Shield, Fire TV, Chromecast.
Audience: Users viewing on a 10-foot TV display using a remote control D-Pad.

Your roles:
1. IPTV Settings & Troubleshooting: Explain buffer tuning, hardware decoding, Xtream Codes login, M3U playlist imports, and EPG (XMLTV).
2. Content Recommendations: Suggest genres, categories, and organize user-provided channels/VOD without claiming you provide streams.
3. Media3/ExoPlayer Guide: Guide the user on audio tracks, subtitle sync, picture-in-picture, and USB recording.
4. Compliance & Safety: You NEVER provide illegal stream URLs, pirate playlists, or circumvent DRM. Remind users that ElifAI IPTV is an IPTV player only for user-owned playlists.
5. Tone: Polite, premium, concise, TV-friendly (1-3 readable paragraphs or bullet points).`;
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY") {
    try {
      const ai = new import_genai.GoogleGenAI();
      const userMessage = `${prompt}

Current TV Context: Profile=${context.profile || "Master"}, ActivePlaylist=${context.activePlaylist || "User Playlist"}, CurrentChannel=${context.currentChannel || "None"}`;
      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: userMessage,
        config: {
          systemInstruction,
          temperature: 0.7
        }
      });
      const replyText = response.text || "I am ready to help you optimize your ElifAI IPTV experience.";
      return res.json({
        reply: replyText,
        provider: "gemini-3.8-flash",
        status: "success"
      });
    } catch (err) {
      console.warn("Gemini API call failed, falling back to local AI tier:", err?.message);
    }
  }
  const offlineReply = getOfflineFallbackAnswer(prompt);
  return res.json({
    reply: offlineReply,
    provider: "local-knowledge-engine",
    status: "fallback"
  });
});
app.get(["/download/elifai-iptv.apk", "/api/download/apk"], (req, res) => {
  const apkPath = import_path.default.resolve(process.cwd(), "public", "ElifAI-IPTV-v2.5.0-release.apk");
  if (import_fs.default.existsSync(apkPath)) {
    res.setHeader("Content-Type", "application/vnd.android.package-archive");
    res.setHeader("Content-Disposition", 'attachment; filename="ElifAI-IPTV-v2.5.0-release.apk"');
    return res.sendFile(apkPath);
  }
  return res.status(404).json({ error: "Release APK package not found on server." });
});
app.get("/api/system/health", (req, res) => {
  res.json({
    app: "ElifAI IPTV",
    version: "2.5.0-production",
    poweredBy: "ElifAI",
    creator: "Ahmad Bilal",
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "MY_GEMINI_API_KEY"),
    apkDownloadUrl: "/download/elifai-iptv.apk",
    status: "online"
  });
});
async function startServer() {
  const isProduction = process.env.NODE_ENV === "production";
  if (!isProduction) {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.resolve(process.cwd(), "dist");
    if (import_fs.default.existsSync(distPath)) {
      app.use(import_express.default.static(distPath));
      app.get("*", (req, res) => {
        res.sendFile(import_path.default.resolve(distPath, "index.html"));
      });
    }
  }
  app.listen(port, "0.0.0.0", () => {
    console.log(`ElifAI IPTV Server running at http://0.0.0.0:${port}`);
  });
}
startServer().catch((err) => {
  console.error("Failed to start server:", err);
});
