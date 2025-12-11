import React from 'react';
import { RotateCcw, PartyPopper, Star, Heart } from 'lucide-react';

interface ThankYouScreenProps {
  onReturn: () => void;
  voterName: string;
}

const CuteBallCharacter = () => (
  <svg viewBox="0 0 100 100" className="w-32 h-32 drop-shadow-xl">
    {/* Body */}
    <circle cx="50" cy="50" r="45" fill="#fbbf24" stroke="#d97706" strokeWidth="3" />
    {/* Cheeks */}
    <circle cx="25" cy="55" r="6" fill="#fca5a5" opacity="0.6" />
    <circle cx="75" cy="55" r="6" fill="#fca5a5" opacity="0.6" />
    {/* Eyes */}
    <circle cx="35" cy="45" r="5" fill="#374151" />
    <circle cx="65" cy="45" r="5" fill="#374151" />
    {/* Smile */}
    <path d="M 35 65 Q 50 75 65 65" stroke="#374151" strokeWidth="3" fill="none" strokeLinecap="round" />
    {/* Shine */}
    <ellipse cx="65" cy="25" rx="10" ry="5" fill="white" opacity="0.4" transform="rotate(-20 65 25)" />
  </svg>
);

export const ThankYouScreen: React.FC<ThankYouScreenProps> = ({ onReturn, voterName }) => {
  return (
    <div className="fixed inset-0 z-50 bg-sky-50 flex flex-col items-center justify-center p-4 animate-vote">
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full space-y-8 text-center border-4 border-yellow-200">
        
        {/* Animated Illustration Area */}
        <div className="relative h-48 flex items-center justify-center">
          <div className="absolute top-0 animate-bounce delay-75 text-yellow-400">
            <Star size={32} fill="currentColor" />
          </div>
          <div className="absolute top-8 right-12 animate-pulse text-pink-400">
            <Heart size={24} fill="currentColor" />
          </div>
          <div className="absolute top-8 left-12 animate-pulse text-blue-400">
            <PartyPopper size={24} />
          </div>
          
          <div className="animate-[bounce_2s_infinite]">
            <CuteBallCharacter />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-black text-slate-700 mb-2">投票ありがとう！</h2>
          <p className="text-lg font-bold text-slate-600 mb-1">{voterName} さん</p>
          <p className="text-sm text-slate-400">あなたの1票を受け取りました</p>
        </div>

        <button
          onClick={onReturn}
          className="w-full bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
          <RotateCcw className="group-hover:-rotate-180 transition-transform duration-500" />
          最初の画面に戻る
        </button>
      </div>
      
      {/* Confetti background elements (Static for performance, but positioned to look nice) */}
      <div className="absolute top-10 left-10 w-3 h-3 bg-red-400 rounded-full opacity-50"></div>
      <div className="absolute bottom-20 right-10 w-4 h-4 bg-blue-400 rounded-full opacity-50"></div>
      <div className="absolute top-1/2 left-5 w-2 h-2 bg-green-400 rounded-full opacity-50"></div>
      <div className="absolute top-20 right-1/4 w-3 h-3 bg-yellow-400 rounded-full opacity-50"></div>
    </div>
  );
};