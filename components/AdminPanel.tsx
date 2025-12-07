import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Pencil, RotateCcw } from 'lucide-react';
import { Game, SiteConfig } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  config: SiteConfig;
  setConfig: (c: SiteConfig) => void;
  games: Game[];
  setGames: (g: Game[]) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, config, setConfig, games, setGames }) => {
  const [activeTab, setActiveTab] = useState<'settings' | 'games'>('settings');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form state for adding/editing games
  const [formData, setFormData] = useState<Partial<Game>>({
    title: '',
    description: '',
    rating: 5,
    downloads: '100K',
    platform: 'Both',
    category: 'Action',
    image: 'https://picsum.photos/200'
  });

  if (!isOpen) return null;

  const handleConfigChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfig({ ...config, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setEditingId(null);
    setFormData({
        title: '',
        description: '',
        rating: 5,
        downloads: '100K',
        platform: 'Both',
        category: 'Action',
        image: 'https://picsum.photos/200'
    });
  };

  const handleSubmitGame = () => {
    if (!formData.title) return;

    if (editingId) {
        // Update existing game
        const updatedGames = games.map(g => 
            g.id === editingId ? { ...g, ...formData } as Game : g
        );
        setGames(updatedGames);
    } else {
        // Add new game
        const game: Game = {
            id: Date.now().toString(),
            title: formData.title || 'New Game',
            description: formData.description || 'Enhanced gameplay features unlocked.',
            image: formData.image || 'https://picsum.photos/200',
            rating: formData.rating || 5,
            downloads: formData.downloads || '1K',
            platform: (formData.platform as 'Android' | 'iOS' | 'Both') || 'Both',
            category: formData.category || 'General',
            tags: ['Mod', 'Premium']
        };
        setGames([game, ...games]);
    }
    resetForm();
  };

  const handleEditClick = (game: Game) => {
    setEditingId(game.id);
    setFormData(game);
  };

  const handleDeleteGame = (id: string) => {
    const updatedGames = games.filter(g => g.id !== id);
    setGames(updatedGames);
    // If we are currently editing the deleted game, reset the form
    if (editingId === id) {
        resetForm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex justify-center items-center p-4">
      <div className="bg-[#1a1b20] border border-gray-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold text-white">Admin Tools</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700">
          <button 
            onClick={() => setActiveTab('settings')}
            className={`flex-1 py-3 font-semibold ${activeTab === 'settings' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            General Settings
          </button>
          <button 
            onClick={() => setActiveTab('games')}
            className={`flex-1 py-3 font-semibold ${activeTab === 'games' ? 'bg-yellow-500 text-black' : 'text-gray-400 hover:bg-gray-800'}`}
          >
            Manage Games
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto custom-scrollbar">
          
          {activeTab === 'settings' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Website Name (Logo Text)</label>
                <input 
                  type="text" 
                  name="siteName"
                  value={config.siteName}
                  onChange={handleConfigChange}
                  className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Hero Subtitle</label>
                <input 
                  type="text" 
                  name="heroSubtitle"
                  value={config.heroSubtitle}
                  onChange={handleConfigChange}
                  className="w-full bg-black border border-gray-600 rounded p-2 text-white focus:border-yellow-500 focus:outline-none"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-yellow-900/20 border border-yellow-500/30 rounded-lg">
                    <label className="block text-sm font-bold text-yellow-400 mb-1">Locker URL</label>
                    <p className="text-xs text-gray-400 mb-2">Redirect link (OGAds/CPAGrip).</p>
                    <input 
                    type="text" 
                    name="lockerUrl"
                    value={config.lockerUrl}
                    onChange={handleConfigChange}
                    className="w-full bg-black border border-yellow-600 rounded p-2 text-white focus:border-yellow-400 focus:outline-none text-sm"
                    placeholder="https://..."
                    />
                </div>
                <div className="p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
                    <label className="block text-sm font-bold text-red-400 mb-1">Adsterra Key / Token</label>
                    <p className="text-xs text-gray-400 mb-2">Enter your banner key (e.g., 728x90).</p>
                    <input 
                    type="text" 
                    name="adsterraKey"
                    value={config.adsterraKey}
                    onChange={handleConfigChange}
                    className="w-full bg-black border border-red-600 rounded p-2 text-white focus:border-red-400 focus:outline-none text-sm"
                    placeholder="e.g. 8473hfd8374..."
                    />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'games' && (
            <div className="space-y-6">
              {/* Add/Edit Game Form */}
              <div className={`p-4 rounded-lg border ${editingId ? 'bg-blue-900/20 border-blue-500/50' : 'bg-black/30 border-gray-700'}`}>
                <div className="flex justify-between items-center mb-3">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        {editingId ? <><Pencil size={18} /> Edit Game</> : <><Plus size={18} /> Add New Game</>}
                    </h3>
                    {editingId && (
                        <button onClick={resetForm} className="text-xs text-gray-400 hover:text-white flex items-center gap-1 bg-gray-800 px-2 py-1 rounded">
                            <RotateCcw size={12} /> Cancel Edit
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <input 
                    placeholder="Game Title" 
                    value={formData.title}
                    onChange={e => setFormData({...formData, title: e.target.value})}
                    className="bg-[#1a1b20] border border-gray-600 rounded p-2 text-white"
                  />
                  <input 
                    placeholder="Category (e.g., Action)" 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="bg-[#1a1b20] border border-gray-600 rounded p-2 text-white"
                  />
                  <input 
                    placeholder="Downloads (e.g., 500K)" 
                    value={formData.downloads}
                    onChange={e => setFormData({...formData, downloads: e.target.value})}
                    className="bg-[#1a1b20] border border-gray-600 rounded p-2 text-white"
                  />
                   <select 
                    value={formData.platform}
                    onChange={e => setFormData({...formData, platform: e.target.value as any})}
                    className="bg-[#1a1b20] border border-gray-600 rounded p-2 text-white"
                  >
                    <option value="Android">Android</option>
                    <option value="iOS">iOS</option>
                    <option value="Both">Both</option>
                  </select>
                  <input 
                    placeholder="Image URL" 
                    value={formData.image}
                    onChange={e => setFormData({...formData, image: e.target.value})}
                    className="bg-[#1a1b20] border border-gray-600 rounded p-2 text-white md:col-span-2"
                  />
                  <textarea 
                    placeholder="Short Description" 
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="bg-[#1a1b20] border border-gray-600 rounded p-2 text-white md:col-span-2"
                  />
                </div>
                <button 
                  onClick={handleSubmitGame}
                  className={`mt-3 w-full font-bold py-2 rounded flex items-center justify-center gap-2 text-white transition-colors ${editingId ? 'bg-blue-600 hover:bg-blue-500' : 'bg-green-600 hover:bg-green-500'}`}
                >
                  {editingId ? <><Save size={18} /> Update Game</> : <><Plus size={18} /> Add Game</>}
                </button>
              </div>

              {/* List Games */}
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Existing Games</h3>
                {games.map(game => (
                  <div key={game.id} className={`flex justify-between items-center p-3 rounded border transition-colors ${editingId === game.id ? 'bg-blue-900/10 border-blue-500' : 'bg-black/40 border-gray-800 hover:border-gray-600'}`}>
                    <div className="flex items-center gap-3">
                      <img src={game.image} className="w-10 h-10 rounded object-cover" alt="" />
                      <div>
                        <div className="font-bold text-sm text-white">{game.title}</div>
                        <div className="text-xs text-gray-400">{game.category}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                        <button 
                            type="button"
                            onClick={() => handleEditClick(game)}
                            className={`p-2 rounded-full transition-colors ${editingId === game.id ? 'text-blue-400 bg-blue-900/20' : 'text-blue-500 hover:text-blue-400 hover:bg-blue-500/10'}`}
                            title="Edit Game"
                        >
                            <Pencil size={18} />
                        </button>
                        <button 
                            type="button"
                            onClick={() => handleDeleteGame(game.id)}
                            className="text-red-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-full transition-colors"
                            title="Delete Game"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                  </div>
                ))}
                {games.length === 0 && (
                  <p className="text-gray-500 text-center py-4">No games available.</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-700 bg-[#1a1b20] rounded-b-2xl">
            <button onClick={onClose} className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded">
                Close & Save
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;