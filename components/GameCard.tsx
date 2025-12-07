import React from 'react';
import { Star, Smartphone, Apple, Zap } from 'lucide-react';
import { Game } from '../types';

interface GameCardProps {
  game: Game;
  onDownload: () => void;
}

const GameCard: React.FC<GameCardProps> = ({ game, onDownload }) => {
  return (
    <div className="bg-[#1a1b20] border border-gray-800 rounded-xl p-4 flex flex-col hover:border-yellow-500/50 transition-all duration-300 shadow-lg relative group overflow-hidden">
      
      {/* Hover Glow Effect */}
      <div className="absolute inset-0 bg-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

      <div className="flex items-start gap-4 mb-4 z-10">
        <img 
          src={game.image} 
          alt={game.title} 
          className="w-20 h-20 rounded-2xl shadow-md object-cover border-2 border-gray-700"
        />
        <div className="flex-1">
          <h3 className="text-xl font-bold text-white leading-tight mb-1">{game.title}</h3>
          <p className="text-gray-400 text-xs line-clamp-2 mb-2">{game.description}</p>
          
          <div className="flex flex-wrap gap-1">
            <span className="bg-green-900/40 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-green-900">
              <Smartphone size={10} /> ANDROID
            </span>
            {(game.platform === 'iOS' || game.platform === 'Both') && (
              <span className="bg-gray-700/40 text-gray-300 text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 border border-gray-600">
                <Apple size={10} /> IOS
              </span>
            )}
            <span className="bg-gray-800 text-gray-400 text-[10px] px-2 py-0.5 rounded border border-gray-700">
              #{game.category}
            </span>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-auto z-10">
        <div className="flex items-center gap-1">
          <div className="flex text-yellow-500">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                size={14} 
                fill={i < Math.floor(game.rating) ? "currentColor" : "none"} 
                className={i < Math.floor(game.rating) ? "" : "text-gray-600"}
              />
            ))}
          </div>
        </div>
        <div className="flex items-center text-yellow-400 font-bold text-xs">
          <Zap size={12} className="mr-1" fill="currentColor" />
          {game.downloads}
        </div>
      </div>

      <button 
        onClick={onDownload}
        className="w-full mt-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black font-extrabold py-3 rounded-lg shadow-lg shadow-yellow-900/20 transform active:scale-95 transition-all z-10"
      >
        Download
      </button>
    </div>
  );
};

export default GameCard;