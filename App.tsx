import React, { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, Settings, ShieldCheck, Download, AlertCircle, Menu } from 'lucide-react';
import GameCard from './components/GameCard';
import AdminPanel from './components/AdminPanel';
import { Game, SiteConfig } from './types';

// Mock Data
const INITIAL_GAMES: Game[] = [
  {
    id: '1',
    title: 'Clash Royale Mod',
    description: 'Unlimited Gems, Gold, and Max Level Cards instantly.',
    image: 'https://picsum.photos/id/10/200/200',
    rating: 4.8,
    downloads: '368K',
    platform: 'Both',
    category: 'Strategy',
    tags: ['Strategy', 'Mod Menu']
  },
  {
    id: '2',
    title: 'Zooba Mod Menu',
    description: 'Wallhack, Speed Boost, and No Cooldown unlocked.',
    image: 'https://picsum.photos/id/20/200/200',
    rating: 4.7,
    downloads: '408K',
    platform: 'Android',
    category: 'Action',
    tags: ['Action', 'Battle Royale']
  },
  {
    id: '3',
    title: 'Minecraft PE Mod',
    description: 'God Mode, Unlocked Skins, and Texture Packs included.',
    image: 'https://picsum.photos/id/30/200/200',
    rating: 4.9,
    downloads: '1.2M',
    platform: 'Both',
    category: 'Sandbox',
    tags: ['Creative', 'Survival']
  },
  {
    id: '4',
    title: 'Among Us Mod',
    description: 'Always Imposter, No Kill Cooldown, See Ghosts.',
    image: 'https://picsum.photos/id/40/200/200',
    rating: 4.5,
    downloads: '469K',
    platform: 'Android',
    category: 'Strategy',
    tags: ['Multiplayer']
  },
  {
    id: '5',
    title: 'eFootball 2024 Mod',
    description: 'Unlimited Coins and GP. All players unlocked.',
    image: 'https://picsum.photos/id/50/200/200',
    rating: 4.6,
    downloads: '332K',
    platform: 'Both',
    category: 'Sports',
    tags: ['Sports', 'Football']
  },
  {
    id: '6',
    title: 'Red Dead Mobile',
    description: 'Unofficial mobile port optimized for high-end devices.',
    image: 'https://picsum.photos/id/60/200/200',
    rating: 4.8,
    downloads: '457K',
    platform: 'iOS',
    category: 'Action',
    tags: ['Open World']
  },
];

const INITIAL_CONFIG: SiteConfig = {
  siteName: "MODZONE",
  lockerUrl: "https://www.google.com", 
  heroSubtitle: "GAME MODS APK",
  adsterraKey: ""
};

// Component to handle Adsterra Script Injection
const AdsterraBanner = ({ adKey }: { adKey: string }) => {
  const bannerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!bannerRef.current || !adKey) return;
    
    // Clear previous content
    bannerRef.current.innerHTML = '';
    
    try {
        // Create script configuration
        const script1 = document.createElement('script');
        script1.type = 'text/javascript';
        script1.innerHTML = `
            if (typeof atOptions === 'undefined') {
                atOptions = {
                    'key' : '${adKey}',
                    'format' : 'iframe',
                    'height' : 90,
                    'width' : 728,
                    'params' : {}
                };
            }
        `;
        
        // Create script loader
        const script2 = document.createElement('script');
        script2.type = 'text/javascript';
        // This is a standard Adsterra invoke pattern, might vary based on user specific code
        script2.src = `//www.highperformanceformat.com/${adKey}/invoke.js`; 
        
        bannerRef.current.appendChild(script1);
        bannerRef.current.appendChild(script2);
    } catch (e) {
        console.error("Ad injection failed", e);
    }
    
  }, [adKey]);

  return (
    <div className="flex justify-center items-center w-full overflow-hidden bg-[#15161a] border border-gray-800 rounded-xl min-h-[90px]">
        <div ref={bannerRef} className="ad-container" />
        {/* Fallback visual if script is blocked or loading */}
        <p className="text-gray-600 text-xs font-mono absolute pointer-events-none">
             Adsterra Ad Loading... (Key: {adKey.substring(0,6)}...)
        </p>
    </div>
  );
};

const App: React.FC = () => {
  // Load games from localStorage or use initial data
  const [games, setGames] = useState<Game[]>(() => {
    const savedGames = localStorage.getItem('modzone_games');
    return savedGames ? JSON.parse(savedGames) : INITIAL_GAMES;
  });

  // Load config from localStorage or use initial data
  const [config, setConfig] = useState<SiteConfig>(() => {
    const savedConfig = localStorage.getItem('modzone_config');
    return savedConfig ? JSON.parse(savedConfig) : INITIAL_CONFIG;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  // Save games to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('modzone_games', JSON.stringify(games));
  }, [games]);

  // Save config to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('modzone_config', JSON.stringify(config));
  }, [config]);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');

  const categories = ['All Categories', ...Array.from(new Set(games.map(g => g.category)))];

  const filteredGames = games.filter(game => {
    const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = selectedPlatform === 'All Platforms' || 
                            game.platform === 'Both' || 
                            game.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'All Categories' || game.category === selectedCategory;
    
    return matchesSearch && matchesPlatform && matchesCategory;
  });

  const handleDownload = () => {
    // This is the Locker Logic
    window.open(config.lockerUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#0f0f11] text-gray-200 font-sans pb-20">
      {/* Navbar / Admin Trigger */}
      <nav className="flex justify-between items-center p-4 max-w-7xl mx-auto">
        <div className="text-xs text-gray-500 font-mono">v3.5.0-ads</div>
        <button 
          onClick={() => setIsAdminOpen(true)}
          className="text-gray-500 hover:text-yellow-500 transition-colors flex items-center gap-2 text-sm uppercase tracking-widest font-bold"
        >
          <Settings size={16} /> Admin Tools
        </button>
      </nav>

      {/* Header */}
      <header className="text-center pt-8 pb-12 px-4 relative overflow-hidden">
         {/* Background Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/20 blur-[100px] rounded-full pointer-events-none"></div>

        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-red-500 via-red-600 to-red-800 drop-shadow-2xl font-[900] transform scale-y-110 mb-2" style={{ textShadow: '0px 0px 20px rgba(220, 38, 38, 0.5)' }}>
          {config.siteName}
        </h1>
        
        <div className="inline-block bg-[#2a2b30] text-gray-400 text-2xl md:text-3xl font-black px-4 py-1 uppercase tracking-widest mb-6 rounded-sm border-b-4 border-[#1f2025]">
          {config.heroSubtitle}
        </div>

        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base mb-8">
          Find your mod, review features, then install via the secure human-verification locker. 
          After verification, the download starts automatically.
        </p>

        {/* Search & Filter Bar */}
        <div className="max-w-5xl mx-auto bg-[#1a1b20] p-3 rounded-2xl shadow-2xl border border-gray-800 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                <input 
                  type="text" 
                  placeholder="Search games & apps..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111216] text-white pl-12 pr-4 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none transition-colors"
                />
            </div>
            
            <div className="relative md:w-48">
                <select 
                  value={selectedPlatform}
                  onChange={(e) => setSelectedPlatform(e.target.value)}
                  className="w-full appearance-none bg-[#111216] text-white pl-4 pr-10 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none"
                >
                    <option>All Platforms</option>
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>

            <div className="relative md:w-48">
                <select 
                   value={selectedCategory}
                   onChange={(e) => setSelectedCategory(e.target.value)}
                   className="w-full appearance-none bg-[#111216] text-white pl-4 pr-10 py-3 rounded-xl border border-gray-700 focus:border-yellow-500 focus:outline-none"
                >
                    {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={16} />
            </div>

            <button className="bg-yellow-500 hover:bg-yellow-400 text-black font-extrabold px-8 py-3 rounded-xl transition-colors shadow-[0_0_15px_rgba(234,179,8,0.4)]">
                Search
            </button>
        </div>
      </header>

      {/* Ad Space */}
      <div className="max-w-4xl mx-auto mb-12 px-4">
        {config.adsterraKey ? (
            <AdsterraBanner adKey={config.adsterraKey} />
        ) : (
            <div className="h-24 bg-[#15161a] border border-gray-800 rounded-xl flex flex-col items-center justify-center relative overflow-hidden group">
                <div className="absolute top-2 left-2 bg-yellow-900/40 text-yellow-600 text-[10px] px-1 rounded border border-yellow-900/50">Ad Space</div>
                <p className="text-gray-600 text-sm font-mono group-hover:text-gray-500 transition-colors">Advertisement Placeholders (Add Key in Admin)</p>
            </div>
        )}
      </div>

      {/* Content Grid */}
      <main className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
            <h2 className="text-2xl font-bold text-yellow-500 uppercase tracking-wider">All Games & Apps</h2>
            <div className="h-px flex-1 bg-gradient-to-r from-yellow-500/50 to-transparent"></div>
        </div>

        {filteredGames.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map(game => (
              <GameCard key={game.id} game={game} onDownload={handleDownload} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-gray-500">
            <p className="text-xl">No games found matching your criteria.</p>
          </div>
        )}
      </main>

       {/* FAQ Section */}
       <section className="max-w-5xl mx-auto px-4 mt-20">
          <h2 className="text-2xl font-bold text-yellow-500 uppercase tracking-wider mb-6">FAQ & Human Verification</h2>
          
          <div className="space-y-3">
              {[
                "What is the human-verification locker?",
                "Is this website safe?",
                "Android install instructions?",
                "iOS install instructions?",
                "Locker didn't open?"
              ].map((q, idx) => (
                <div key={idx} className="bg-[#15161a] border border-gray-800 rounded-lg p-4 flex justify-between items-center cursor-pointer hover:bg-[#1f2025] transition-colors group">
                    <span className="font-semibold text-gray-300 group-hover:text-white transition-colors">{q}</span>
                    <ChevronDown size={16} className="text-gray-600" />
                </div>
              ))}
          </div>
       </section>
      
       {/* Footer */}
       <footer className="mt-20 pt-10 border-t border-gray-800 text-center text-gray-600 text-sm">
          <p className="mb-2">&copy; 2025 {config.siteName} — All rights reserved.</p>
          <p>We are not affiliated with any game developers. All mods are for educational purposes.</p>
       </footer>

      {/* Admin Modal */}
      <AdminPanel 
        isOpen={isAdminOpen} 
        onClose={() => setIsAdminOpen(false)}
        config={config}
        setConfig={setConfig}
        games={games}
        setGames={setGames}
      />
    </div>
  );
};

export default App;