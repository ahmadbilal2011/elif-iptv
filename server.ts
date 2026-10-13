import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const port = parseInt(process.env.PORT || '3000', 10);

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

// Knowledge Base for Level 4 Offline AI Fallback & Instant TV Support
const OFFLINE_KNOWLEDGE_BASE = [
  {
    keywords: ['buffer', 'buffering', 'lag', 'freeze', 'freezing', 'stutter'],
    answer: "Buffering troubleshooting for ElifAI IPTV on Android TV:\n1. Open Settings > Playback Settings > Buffer Tuning and switch buffer from 'Standard (2s)' to 'Large (10s)' or 'Extreme (25s)'.\n2. Toggle Hardware Acceleration (MediaCodec) to 'Auto' or try 'Software Fallback' if the MPEG-TS codec struggles.\n3. Change player engine to Media3 / ExoPlayer Tunneling mode.\n4. Ensure 5GHz Wi-Fi or Ethernet connection on your Android TV Box / Nvidia Shield.\n5. Verify your IPTV provider bandwidth limit."
  },
  {
    keywords: ['xtream', 'login', 'server url', 'error 401', 'error 403', 'authentication'],
    answer: "Xtream Codes connection guide:\n1. Server URL format must be exact, e.g., 'http://provider.tv:8080' (do not include trailing / or /get.php).\n2. Verify username and password (case-sensitive).\n3. Check if your provider has an active expiration date or MAC address lock.\n4. If your ISP blocks IPTV DNS, configure Cloudflare DNS (1.1.1.1) in Android TV network settings."
  },
  {
    keywords: ['epg', 'guide', 'xmltv', 'no program', 'schedule'],
    answer: "Electronic Program Guide (EPG) setup:\n1. ElifAI IPTV automatically extracts EPG from Xtream Codes accounts.\n2. For manual M3U, enter the XMLTV URL in Settings > EPG Settings > Manual EPG URL.\n3. Turn on 'Automatic EPG Refresh' (every 12 or 24 hours).\n4. In the Live TV player, press UP/DOWN on your TV Remote D-Pad to open the Grid TV Guide."
  },
  {
    keywords: ['record', 'recording', 'usb', 'schedule record', 'dvr'],
    answer: "ElifAI IPTV Recording engine:\n1. Android TV supports both Internal Storage and USB external drives (FAT32/exFAT).\n2. Long-press OK / Select on any channel or EPG program to schedule a background recording.\n3. Access recordings anytime in the 'Recordings Manager' tab on the Home Screen."
  },
  {
    keywords: ['legal', 'copyright', 'piracy', 'dmca', 'terms', 'safe'],
    answer: "Legal Compliance Notice:\nElifAI IPTV is strictly a media player application created by Ahmad Bilal and powered by ElifAI. It does NOT host, supply, distribute, or curate any streams, channels, or copyrighted materials. Users must supply their own legally obtained IPTV credentials (Xtream Codes or M3U)."
  },
  {
    keywords: ['remote', 'dpad', 'controller', 'navigation', 'shortcuts'],
    answer: "Android TV Remote Shortcuts in ElifAI IPTV:\n• D-Pad UP/DOWN: Quick Channel Switch & EPG mini-bar\n• D-Pad LEFT: Category & Playlist drawer\n• D-Pad RIGHT: Audio & Subtitle stream picker\n• OK / ENTER: Play / Pause & Show OSD Controls\n• BACK: Exit player / Return to previous channel (Last Channel Return)\n• YELLOW / MENU button: ElifAI Assistant voice trigger"
  }
];

function getOfflineFallbackAnswer(query: string): string {
  const q = query.toLowerCase();
  for (const item of OFFLINE_KNOWLEDGE_BASE) {
    if (item.keywords.some(k => q.includes(k))) {
      return item.answer;
    }
  }
  return "ElifAI Assistant (Offline TV Mode):\nI am running in offline mode. I can assist you with Xtream Codes login, M3U playlist importing, EPG configuration, buffer tuning, USB recording, and D-Pad remote navigation. What would you like help with?";
}

// AI Assistant endpoint
app.post('/api/ai/assistant', async (req, res) => {
  const { prompt, context = {}, providerPreference = 'auto' } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // System instruction for ElifAI Assistant
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

  // Attempt Gemini API if key exists
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY') {
    try {
      const ai = new GoogleGenAI();
      const userMessage = `${prompt}\n\nCurrent TV Context: Profile=${context.profile || 'Master'}, ActivePlaylist=${context.activePlaylist || 'User Playlist'}, CurrentChannel=${context.currentChannel || 'None'}`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userMessage,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.7,
        }
      });

      const replyText = response.text || "I am ready to help you optimize your ElifAI IPTV experience.";
      return res.json({
        reply: replyText,
        provider: 'gemini-3.8-flash',
        status: 'success'
      });
    } catch (err: any) {
      console.warn('Gemini API call failed, falling back to local AI tier:', err?.message);
    }
  }

  // Fallback to Knowledge Base / Local AI Engine
  const offlineReply = getOfflineFallbackAnswer(prompt);
  return res.json({
    reply: offlineReply,
    provider: 'local-knowledge-engine',
    status: 'fallback'
  });
});

// Direct Android TV APK Download Route
app.get(['/download/elifai-iptv.apk', '/api/download/apk'], (req, res) => {
  const apkPath = path.resolve(process.cwd(), 'public', 'ElifAI-IPTV-v2.5.0-release.apk');
  if (fs.existsSync(apkPath)) {
    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="ElifAI-IPTV-v2.5.0-release.apk"');
    return res.sendFile(apkPath);
  }
  return res.status(404).json({ error: 'Release APK package not found on server.' });
});

// Health check endpoint
app.get('/api/system/health', (req, res) => {
  res.json({
    app: 'ElifAI IPTV',
    version: '2.5.0-production',
    poweredBy: 'ElifAI',
    creator: 'Ahmad Bilal',
    geminiConfigured: !!(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    apkDownloadUrl: '/download/elifai-iptv.apk',
    status: 'online'
  });
});

async function startServer() {
  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(distPath, 'index.html'));
      });
    }
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`ElifAI IPTV Server running at http://0.0.0.0:${port}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
