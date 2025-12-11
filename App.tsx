
import React, { useState, useEffect, useMemo } from 'react';
import { Vote, TeamColor, TeamStats, Comment } from './types';
import { Basket } from './components/Basket';
import { CommentSection } from './components/CommentSection';
import { ThankYouScreen } from './components/ThankYouScreen';
import { Trophy, Users, User, Edit2, CheckCircle, Trash2 } from 'lucide-react';

const TEAMS: Record<TeamColor, Omit<TeamStats, 'count'>> = {
  red: {
    color: 'red',
    label: 'あか組',
    theme: {
      bg: 'bg-red-500',
      text: 'text-white',
      border: 'border-red-500',
      ball: 'bg-red-500',
      shadow: 'shadow-red-200'
    }
  },
  white: {
    color: 'white',
    label: 'しろ組',
    theme: {
      bg: 'bg-white',
      text: 'text-slate-700',
      border: 'border-slate-300',
      ball: 'bg-slate-100',
      shadow: 'shadow-slate-200'
    }
  },
  blue: {
    color: 'blue',
    label: 'あお組',
    theme: {
      bg: 'bg-blue-500',
      text: 'text-white',
      border: 'border-blue-500',
      ball: 'bg-blue-500',
      shadow: 'shadow-blue-200'
    }
  }
};

const STORAGE_KEY_VOTES = 'tamaire_votes_v1';
const STORAGE_KEY_COMMENTS = 'tamaire_comments_v1';

export default function App() {
  const [name, setName] = useState('');
  const [votes, setVotes] = useState<Vote[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isNameSet, setIsNameSet] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  
  // Load data from local storage
  useEffect(() => {
    const savedVotes = localStorage.getItem(STORAGE_KEY_VOTES);
    if (savedVotes) {
      try {
        setVotes(JSON.parse(savedVotes));
      } catch (e) {
        console.error("Failed to load votes", e);
      }
    }

    const savedComments = localStorage.getItem(STORAGE_KEY_COMMENTS);
    if (savedComments) {
      try {
        setComments(JSON.parse(savedComments));
      } catch (e) {
        console.error("Failed to load comments", e);
      }
    }
  }, []);

  // Save votes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_VOTES, JSON.stringify(votes));
  }, [votes]);

  // Save comments
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_COMMENTS, JSON.stringify(comments));
  }, [comments]);

  // Derived state
  const currentVote = useMemo(() => 
    votes.find(v => v.name.trim().toLowerCase() === name.trim().toLowerCase()), 
    [votes, name]
  );

  const stats = useMemo(() => {
    const counts: Record<TeamColor, number> = { red: 0, white: 0, blue: 0 };
    votes.forEach(v => {
      if (counts[v.choice] !== undefined) {
        counts[v.choice]++;
      }
    });
    return Object.values(TEAMS).map(team => ({
      ...team,
      count: counts[team.color]
    }));
  }, [votes]);

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      setIsNameSet(true);
    }
  };

  const handleVote = (color: TeamColor) => {
    if (!name.trim()) return;

    const newVote: Vote = {
      id: Date.now().toString(),
      name: name.trim(),
      choice: color,
      timestamp: Date.now()
    };

    setVotes(prev => {
      const filtered = prev.filter(v => v.name.toLowerCase() !== name.trim().toLowerCase());
      return [newVote, ...filtered];
    });
  };

  const handleEditVote = (voterName: string) => {
    setName(voterName);
    setIsNameSet(true);
    setShowThankYou(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteVote = (voteId: string, voterName: string) => {
    if (window.confirm(`${voterName}さんの投票データを削除しますか？`)) {
      setVotes(prev => prev.filter(v => v.id !== voteId));
      
      // もし現在ログイン中の名前と同じ名前のデータを削除した場合は、初期画面に戻す
      if (voterName.toLowerCase() === name.trim().toLowerCase()) {
        handleReturnToStart();
      }
    }
  };

  const handleResetName = () => {
    setIsNameSet(false);
    setName('');
  };

  const handleFinish = () => {
    setShowThankYou(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReturnToStart = () => {
    setShowThankYou(false);
    setIsNameSet(false);
    setName('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddComment = (teamColor: TeamColor, userName: string, text: string) => {
    const newComment: Comment = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      teamColor,
      userName: userName.trim(),
      text: text.trim(),
      timestamp: Date.now(),
    };
    setComments(prev => [...prev, newComment]);
  };

  const handleEditComment = (id: string, newText: string) => {
    setComments(prev => prev.map(c => 
      c.id === id ? { ...c, text: newText } : c
    ));
  };

  const handleDeleteComment = (id: string) => {
    if (window.confirm('本当にこのコメントを削除しますか？')) {
      setComments(prev => prev.filter(c => c.id !== id));
    }
  };

  if (showThankYou) {
    return <ThankYouScreen onReturn={handleReturnToStart} voterName={name} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <header className="bg-yellow-400 p-4 shadow-md sticky top-0 z-40">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-800 flex items-center gap-2">
            <Trophy className="text-slate-800" />
            みんなの玉入れ
          </h1>
          <div className="text-xs font-bold bg-white/30 px-2 py-1 rounded-lg text-slate-900">
            合計: {votes.length}票
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto p-4 space-y-8">
        <section className={`bg-white rounded-2xl p-6 shadow-sm transition-all duration-300 ${isNameSet ? 'border-2 border-green-100' : 'scale-100'}`}>
          {!isNameSet ? (
            <form onSubmit={handleNameSubmit} className="space-y-4">
              <div className="text-center">
                <label htmlFor="name" className="block text-lg font-bold text-slate-700 mb-2">
                  お名前を教えてね
                </label>
                <p className="text-sm text-slate-400 mb-4">投票するには名前を入力してスタート！</p>
              </div>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="例：たなか ゆうと"
                  className="w-full pl-10 pr-4 py-3 text-lg border-2 border-slate-200 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none transition-colors"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                スタート <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              </button>
            </form>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400">ようこそ</p>
                <p className="text-xl font-bold text-slate-800">{name} さん</p>
              </div>
              <button 
                onClick={handleResetName}
                className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-2 rounded-lg hover:bg-slate-200"
              >
                名前を変える
              </button>
            </div>
          )}
        </section>

        {isNameSet && (
          <section className="animate-vote">
            <div className="text-center mb-6">
              <h2 className="text-lg font-bold text-slate-600 mb-1">
                {currentVote ? '投票ありがとう！変更もできるよ' : '好きな色のカゴをタップ！'}
              </h2>
              <div className="h-1 w-16 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid grid-cols-3 gap-4 items-end h-64 mb-4">
              {stats.map((stat) => (
                <Basket
                  key={stat.color}
                  team={stat}
                  isSelected={currentVote?.choice === stat.color}
                  onVote={handleVote}
                  disabled={false}
                />
              ))}
            </div>
            
            {currentVote && (
              <div className="bg-green-50 text-green-700 p-4 rounded-xl text-center text-sm font-bold border border-green-200 animate-vote">
                 投票完了！ {TEAMS[currentVote.choice].label} に1票入りました！
              </div>
            )}
          </section>
        )}

        {isNameSet && (
          <section>
            <CommentSection 
              teams={stats}
              comments={comments}
              currentUser={name}
              userVoteChoice={currentVote?.choice}
              onAddComment={handleAddComment}
              onEditComment={handleEditComment}
              onDeleteComment={handleDeleteComment}
            />
          </section>
        )}

        {isNameSet && currentVote && (
          <section className="animate-vote">
            <button
               onClick={handleFinish}
               className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg transform transition active:scale-95 flex items-center justify-center gap-3 border-b-4 border-green-600"
             >
               <CheckCircle size={28} />
               <span className="text-xl">投票を終了する</span>
             </button>
             <p className="text-center text-xs text-slate-400 mt-2">
               投票とコメントが終わったら押してね
             </p>
          </section>
        )}

        <section className="pt-8 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-4">
            <Users className="text-slate-400" />
            <h3 className="font-bold text-slate-600">投票した人リスト</h3>
          </div>

          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-slate-100">
            {votes.length === 0 ? (
              <div className="p-8 text-center text-slate-400">
                まだ誰も投票していません。<br/>一番乗りになろう！
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {votes.map((vote) => (
                  <div key={vote.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`
                        w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm text-white
                        ${TEAMS[vote.choice].theme.bg}
                        ${vote.choice === 'white' ? 'border border-slate-200 text-slate-400' : ''}
                      `}>
                        {TEAMS[vote.choice].label.substring(0, 1)}
                      </div>
                      <div>
                        <p className="font-bold text-slate-700">{vote.name}</p>
                        <p className="text-xs text-slate-400">
                          {TEAMS[vote.choice].label} に投票
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEditVote(vote.name)}
                        className="text-slate-400 p-2 hover:bg-slate-200 rounded-lg transition-colors group"
                        title="再投票"
                      >
                        <Edit2 size={18} className="group-hover:text-slate-700" />
                      </button>
                      <button
                        onClick={() => handleDeleteVote(vote.id, vote.name)}
                        className="text-slate-400 p-2 hover:bg-red-50 rounded-lg transition-colors group"
                        title="削除"
                      >
                        <Trash2 size={18} className="group-hover:text-red-500" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
