import { Channel, VodMovie, VodSeries, RadioStation, EpgProgram, Recording, Playlist } from '../types/iptv';

// Public legal test streams (Creative Commons / Public Domain test feeds for media player testing)
export const DEMO_TEST_PLAYLIST: Playlist = {
  id: 'demo-legal-test-playlist',
  name: 'Legal Open Test Suite (Sample)',
  type: 'local_demo',
  contentCount: {
    live: 6,
    vod: 4,
    series: 2,
    radio: 3
  },
  isActive: true,
  lastUpdated: new Date().toISOString(),
  expiryDate: '2030-01-01',
  maxConnections: 1
};

export const INITIAL_CHANNELS: Channel[] = [
  {
    id: 'ch-1',
    name: 'NASA TV Live (Public Domain)',
    logo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&h=120&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    category: 'Science & Tech',
    channelNumber: 101,
    isFavorite: true,
    epgChannelId: 'nasa.tv'
  },
  {
    id: 'ch-2',
    name: 'Blender Open Studio Cinema (CC-BY)',
    logo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    category: 'Movies & Cinema',
    channelNumber: 102,
    isFavorite: true,
    epgChannelId: 'blender.cinema'
  },
  {
    id: 'ch-3',
    name: 'Open Wildlife Documentary Feed',
    logo: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    category: 'Documentary',
    channelNumber: 103,
    isFavorite: false,
    epgChannelId: 'wildlife.doc'
  },
  {
    id: 'ch-4',
    name: 'Global Sports Open Channel (Test)',
    logo: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    category: 'Sports',
    channelNumber: 104,
    isFavorite: false,
    epgChannelId: 'sports.test'
  },
  {
    id: 'ch-5',
    name: 'International News 24/7 (Open)',
    logo: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
    category: 'News',
    channelNumber: 105,
    isFavorite: false,
    epgChannelId: 'news.global'
  },
  {
    id: 'ch-6',
    name: 'Kids Animation Showcase (CC-BY)',
    logo: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    category: 'Kids & Family',
    channelNumber: 106,
    isFavorite: false,
    epgChannelId: 'kids.open'
  }
];

export const INITIAL_VOD_MOVIES: VodMovie[] = [
  {
    id: 'vod-1',
    title: 'Big Buck Bunny (Open Movie)',
    poster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1200&h=600&fit=crop',
    genre: 'Animation / Comedy',
    year: 2008,
    rating: 8.4,
    duration: 10,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    resumePosition: 120,
    synopsis: 'A large and lovable rabbit deals with bullying forest creatures in this iconic open-source 3D animated film.',
    director: 'Sacha Goedegebure',
    cast: ['Bunny', 'Frank', 'Rinky', 'Gimera'],
    isFavorite: true
  },
  {
    id: 'vod-2',
    title: 'Tears of Steel (Open Sci-Fi)',
    poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&h=600&fit=crop',
    genre: 'Sci-Fi / Action',
    year: 2012,
    rating: 7.9,
    duration: 12,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    synopsis: 'In a dystopian future, a group of scientists and soldiers attempt to save the earth by altering memories with robot technology.',
    director: 'Ian Hubert',
    cast: ['Derek de Lint', 'Sergio Hasselbaink', 'Rogier Schippers'],
    isFavorite: false
  },
  {
    id: 'vod-3',
    title: 'Sintel (The Durian Project)',
    poster: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&h=600&fit=crop',
    genre: 'Fantasy / Adventure',
    year: 2010,
    rating: 8.1,
    duration: 15,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    synopsis: 'A lonely young woman searches the lands for Scales, a baby dragon she nurtured back to health who was captured.',
    director: 'Colin Levy',
    cast: ['Halina Reijn', 'Thom Hoffman'],
    isFavorite: true
  },
  {
    id: 'vod-4',
    title: 'Elephants Dream (Orange Project)',
    poster: 'https://images.unsplash.com/photo-1534188753412-3e26d0d618d6?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    genre: 'Surreal / Sci-Fi',
    year: 2006,
    rating: 7.2,
    duration: 11,
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    synopsis: 'Two strange characters explore a surreal machine realm created entirely using open-source tools.',
    director: 'Bassam Kurdali',
    cast: ['Tygo Gernandt', 'Cas Jansen'],
    isFavorite: false
  }
];

export const INITIAL_VOD_SERIES: VodSeries[] = [
  {
    id: 'ser-1',
    title: 'Cosmos & Beyond: Open Deep Space',
    poster: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&h=600&fit=crop',
    genre: 'Documentary / Astronomy',
    seasonsCount: 1,
    rating: 9.1,
    isFavorite: true,
    synopsis: 'An epic voyage across nebulae, distant exoplanets, and black hole physics featuring open NASA and ESA footage.',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Episode 1: The Edge of the Observable Universe',
            duration: 15,
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=300&h=180&fit=crop'
          },
          {
            episodeNumber: 2,
            title: 'Episode 2: Deep Solar Winds & Space Weather',
            duration: 12,
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=300&h=180&fit=crop'
          }
        ]
      }
    ]
  },
  {
    id: 'ser-2',
    title: 'Pioneers of Open Computing',
    poster: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=450&fit=crop',
    backdrop: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&h=600&fit=crop',
    genre: 'Tech / History',
    seasonsCount: 1,
    rating: 8.8,
    isFavorite: false,
    synopsis: 'The thrilling story of how decentralized protocols, Linux, and open standards shaped modern computing.',
    seasons: [
      {
        seasonNumber: 1,
        episodes: [
          {
            episodeNumber: 1,
            title: 'Episode 1: The Genesis of Free Software',
            duration: 14,
            streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
            thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=300&h=180&fit=crop'
          }
        ]
      }
    ]
  }
];

export const INITIAL_RADIO: RadioStation[] = [
  {
    id: 'rad-1',
    name: 'Symphony Classical Radio (Open Stream)',
    logo: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackSeeTheWorld.mp4',
    genre: 'Classical',
    bitrate: '320 kbps',
    isFavorite: true
  },
  {
    id: 'rad-2',
    name: 'Cyberpunk Lo-Fi Chillwave',
    logo: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyBlazes.mp4',
    genre: 'Lo-Fi / Ambient',
    bitrate: '256 kbps',
    isFavorite: false
  },
  {
    id: 'rad-3',
    name: 'World News & Talk Radio',
    logo: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
    genre: 'News / Talk',
    bitrate: '192 kbps',
    isFavorite: false
  }
];

export const INITIAL_EPG: EpgProgram[] = [
  // NASA TV
  {
    id: 'epg-1',
    channelId: 'ch-1',
    title: 'ISS Expedition Live Space Walk',
    description: 'Astronauts perform scheduled maintenance on the International Space Station solar array arrays.',
    startTime: '21:00',
    endTime: '22:30',
    startTimestamp: Date.now() - 30 * 60 * 1000,
    endTimestamp: Date.now() + 60 * 60 * 1000,
    category: 'Science',
    rating: 'G'
  },
  {
    id: 'epg-2',
    channelId: 'ch-1',
    title: 'Deep Space Telescope Discoveries',
    description: 'Astrophysicists analyze the latest deep infrared spectroscopy data from outer star clusters.',
    startTime: '22:30',
    endTime: '23:30',
    startTimestamp: Date.now() + 60 * 60 * 1000,
    endTimestamp: Date.now() + 120 * 60 * 1000,
    category: 'Science',
    rating: 'G'
  },
  // Blender Cinema
  {
    id: 'epg-3',
    channelId: 'ch-2',
    title: 'The Great Forest Adventure',
    description: 'Big Buck Bunny and the meadow inhabitants embark on a hilarious woodland adventure.',
    startTime: '21:15',
    endTime: '22:15',
    startTimestamp: Date.now() - 15 * 60 * 1000,
    endTimestamp: Date.now() + 45 * 60 * 1000,
    category: 'Animation',
    rating: 'PG'
  },
  {
    id: 'epg-4',
    channelId: 'ch-2',
    title: 'Behind the Blender 3D Engine',
    description: 'How open-source artists sculpt, texture, and render film-grade CGI using Python and OpenGL.',
    startTime: '22:15',
    endTime: '23:00',
    startTimestamp: Date.now() + 45 * 60 * 1000,
    endTimestamp: Date.now() + 90 * 60 * 1000,
    category: 'Documentary',
    rating: 'PG'
  },
  // Wildlife
  {
    id: 'epg-5',
    channelId: 'ch-3',
    title: 'Savannah Predators: Night Hunting',
    description: 'High-speed thermal cameras capture nighttime encounters in the Serengeti wilderness.',
    startTime: '21:00',
    endTime: '22:00',
    startTimestamp: Date.now() - 20 * 60 * 1000,
    endTimestamp: Date.now() + 40 * 60 * 1000,
    category: 'Nature',
    rating: 'PG'
  },
  // Sports
  {
    id: 'epg-6',
    channelId: 'ch-4',
    title: 'Championship League Match Highlights',
    description: 'Full tactical analysis and match highlights from the weekend stadium fixtures.',
    startTime: '21:30',
    endTime: '23:00',
    startTimestamp: Date.now() - 10 * 60 * 1000,
    endTimestamp: Date.now() + 80 * 60 * 1000,
    category: 'Sports',
    rating: 'TV-14'
  },
  // News
  {
    id: 'epg-7',
    channelId: 'ch-5',
    title: 'Global Prime Evening News',
    description: 'In-depth global economics, diplomatic summits, and breaking technological breakthroughs.',
    startTime: '21:00',
    endTime: '22:00',
    startTimestamp: Date.now() - 40 * 60 * 1000,
    endTimestamp: Date.now() + 20 * 60 * 1000,
    category: 'News',
    rating: 'G'
  },
  // Kids
  {
    id: 'epg-8',
    channelId: 'ch-6',
    title: 'Tales of the Dragon Mountain',
    description: 'Sintel journeys across icy glaciers in search of her lost companion Scales.',
    startTime: '21:00',
    endTime: '22:30',
    startTimestamp: Date.now() - 10 * 60 * 1000,
    endTimestamp: Date.now() + 80 * 60 * 1000,
    category: 'Kids',
    rating: 'G'
  }
];

export const INITIAL_RECORDINGS: Recording[] = [
  {
    id: 'rec-1',
    title: 'ISS Expedition Live Space Walk',
    channelName: 'NASA TV Live (Public Domain)',
    channelLogo: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=120&h=120&fit=crop',
    streamUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    startTime: 'Yesterday, 19:30',
    durationMinutes: 45,
    storageType: 'internal',
    filePath: '/storage/emulated/0/ElifAI_IPTV/Recordings/rec_iss_walk.ts',
    status: 'completed',
    fileSizeBytes: 1240000000
  },
  {
    id: 'rec-2',
    title: 'Behind the Blender 3D Engine',
    channelName: 'Blender Open Studio Cinema',
    channelLogo: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=120&h=120&fit=crop',
    streamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    startTime: 'Tomorrow, 22:15',
    durationMinutes: 45,
    storageType: 'usb',
    filePath: '/mnt/media_rw/USB_DRIVE_A1/ElifAI_IPTV/rec_blender_engine.ts',
    status: 'scheduled'
  }
];
