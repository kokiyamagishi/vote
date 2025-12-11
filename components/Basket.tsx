import React from 'react';
import { TeamColor, TeamStats } from '../types';
import { Check } from 'lucide-react';

interface BasketProps {
  team: TeamStats;
  isSelected: boolean;
  onVote: (color: TeamColor) => void;
  disabled: boolean;
}

export const Basket: React.FC<BasketProps> = ({ team, isSelected, onVote, disabled }) => {
  return (
    <button
      onClick={() => onVote(team.color)}
      disabled={disabled}
      className={`
        relative flex flex-col items-center justify-end w-full group
        transition-transform duration-200 
        ${!disabled ? 'active:scale-95 hover:-translate-y-1 cursor-pointer' : 'opacity-80 cursor-default'}
      `}
    >
      {/* Selected Indicator */}
      {isSelected && (
        <div className="absolute -top-10 z-20 animate-vote">
          <div className="bg-green-500 text-white p-2 rounded-full shadow-lg border-2 border-white">
            <Check size={24} strokeWidth={4} />
          </div>
        </div>
      )}

      {/* Balls in the basket (Visual candy based on count) */}
      <div className="absolute bottom-[60px] w-20 h-16 overflow-hidden z-0 flex flex-wrap-reverse justify-center gap-1 opacity-90 px-2">
        {Array.from({ length: Math.min(team.count, 12) }).map((_, i) => (
          <div 
            key={i} 
            className={`w-4 h-4 rounded-full shadow-sm ${team.theme.ball} border border-black/10`}
            style={{ 
              transform: `translate(${Math.sin(i) * 5}px, ${Math.cos(i) * 2}px)` 
            }}
          />
        ))}
      </div>

      {/* The Basket Net */}
      <div className={`
        relative z-10 w-24 h-20 rounded-b-3xl border-4
        ${team.theme.border} bg-white/80 basket-net
        flex items-center justify-center shadow-lg
        ${isSelected ? 'ring-4 ring-offset-2 ring-yellow-400' : ''}
      `}>
        {/* Rim */}
        <div className={`absolute -top-1 left-[-4px] right-[-4px] h-3 ${team.theme.bg} rounded-full shadow-md`}></div>
      </div>

      {/* The Pole */}
      <div className="w-3 h-24 bg-slate-300 rounded-b-lg -mt-1 z-0 shadow-inner"></div>

      {/* Label and Count */}
      <div className={`
        mt-2 px-4 py-1 rounded-full font-bold text-lg shadow-sm border
        ${team.theme.bg} ${team.theme.text} ${team.theme.border}
      `}>
        {team.label}: {team.count}
      </div>
    </button>
  );
};