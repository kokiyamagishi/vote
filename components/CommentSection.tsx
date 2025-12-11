
import React, { useState, useEffect } from 'react';
import { TeamColor, Comment, TeamStats } from '../types';
import { Send, Trash2, Edit2, X, Check, MessageSquare, AlertCircle, Lock } from 'lucide-react';

interface CommentSectionProps {
  teams: TeamStats[];
  comments: Comment[];
  currentUser: string;
  userVoteChoice?: TeamColor;
  onAddComment: (team: TeamColor, name: string, text: string) => void;
  onEditComment: (id: string, newText: string) => void;
  onDeleteComment: (id: string) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({
  teams,
  comments,
  currentUser,
  userVoteChoice,
  onAddComment,
  onEditComment,
  onDeleteComment,
}) => {
  const [activeTab, setActiveTab] = useState<TeamColor>('red');
  const [inputText, setInputText] = useState('');
  const [inputName, setInputName] = useState(currentUser);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');

  // 投票したら、そのチームのタブをデフォルトにする
  useEffect(() => {
    if (userVoteChoice) {
      setActiveTab(userVoteChoice);
    }
  }, [userVoteChoice]);

  // 現在のユーザー名の同期
  useEffect(() => {
    if (currentUser) {
      setInputName(currentUser);
    }
  }, [currentUser]);

  const activeComments = comments.filter((c) => c.teamColor === activeTab);
  const activeTeam = teams.find((t) => t.color === activeTab) || teams[0];
  
  // 投票したチームのタブのみコメント可能
  const canCommentOnThisTab = userVoteChoice === activeTab;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !inputName.trim() || !canCommentOnThisTab) return;
    onAddComment(activeTab, inputName, inputText);
    setInputText('');
  };

  const startEdit = (comment: Comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const saveEdit = (id: string) => {
    if (editText.trim()) {
      onEditComment(id, editText);
    }
    setEditingId(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  const getTabTextColor = (team: TeamStats) => {
    if (activeTab !== team.color) return 'text-slate-400 hover:text-slate-600';
    
    if (team.color === 'red') return 'text-red-600 font-black';
    if (team.color === 'white') return 'text-slate-800 font-black';
    if (team.color === 'blue') return 'text-blue-600 font-black';
    return 'text-slate-800';
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 bg-slate-50 border-b border-slate-100 flex items-center gap-2">
        <MessageSquare className="text-slate-400" size={20} />
        <h3 className="font-bold text-slate-600">応援メッセージ</h3>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-100 bg-slate-50/30">
        {teams.map((team) => (
          <button
            key={team.color}
            onClick={() => {
              setActiveTab(team.color);
              setEditingId(null); // タブ切り替え時に編集モード解除
            }}
            className={`flex-1 py-4 text-sm transition-all relative ${getTabTextColor(team)} ${activeTab === team.color ? 'bg-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)]' : ''}`}
          >
            <span className="flex items-center justify-center gap-1">
              {team.label}
              {userVoteChoice === team.color && <Check size={12} className="text-green-500" />}
            </span>
            {activeTab === team.color && (
              <div className={`absolute bottom-0 left-0 right-0 h-1.5 ${team.theme.bg}`} />
            )}
          </button>
        ))}
      </div>

      {/* Messages List */}
      <div className="p-4 min-h-[200px] max-h-[400px] overflow-y-auto bg-slate-50/50 space-y-3">
        {activeComments.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            {activeTeam.label}への応援メッセージはまだありません。<br />
            {canCommentOnThisTab ? '一番乗りのコメントを書こう！' : '投票して応援しよう！'}
          </div>
        ) : (
          activeComments.map((comment) => (
            <div
              key={comment.id}
              className={`p-3 rounded-xl border border-slate-100 shadow-sm bg-white animate-vote ${
                comment.userName === currentUser ? 'ml-8 border-yellow-200 ring-2 ring-yellow-50' : 'mr-8'
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className={`text-xs font-bold ${
                  comment.teamColor === 'red' ? 'text-red-600' : 
                  comment.teamColor === 'blue' ? 'text-blue-600' : 
                  'text-slate-700'
                }`}>
                  {comment.userName}
                </span>
                <span className="text-[10px] text-slate-300">
                  {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>

              {editingId === comment.id ? (
                <div className="mt-1">
                  <textarea
                    className="w-full p-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-yellow-400"
                    rows={2}
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={cancelEdit} className="p-1 text-slate-400 hover:bg-slate-100 rounded">
                      <X size={16} />
                    </button>
                    <button onClick={() => saveEdit(comment.id)} className="p-1 text-green-500 hover:bg-green-50 rounded">
                      <Check size={16} />
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className="text-slate-700 text-sm whitespace-pre-wrap leading-relaxed">{comment.text}</p>
                  
                  {comment.userName === currentUser && (
                    <div className="flex justify-end gap-2 mt-2 border-t border-slate-50 pt-1">
                      <button 
                        onClick={() => startEdit(comment)}
                        className="text-slate-300 hover:text-blue-500 p-1.5 transition-colors rounded-md hover:bg-slate-50"
                        title="編集"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => onDeleteComment(comment.id)}
                        className="text-slate-300 hover:text-red-500 p-1.5 transition-colors rounded-md hover:bg-slate-50"
                        title="削除"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Input Form Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        {!userVoteChoice ? (
          <div className="text-center py-5 bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
             <AlertCircle className="mx-auto text-slate-400 mb-2" size={24} />
             <p className="text-sm font-bold text-slate-500">カゴに玉を入れてからコメントしてね！</p>
          </div>
        ) : !canCommentOnThisTab ? (
          <div className="text-center py-5 bg-amber-50 rounded-xl border border-amber-100">
             <Lock className="mx-auto text-amber-400 mb-2" size={24} />
             <p className="text-sm font-bold text-amber-700 leading-relaxed px-4">
               {teams.find(t => t.color === userVoteChoice)?.label}に投票した人だけ<br/>このチームを応援できるよ！
             </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-2 flex items-center gap-2">
               <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">名前:</label>
               <input
                 type="text"
                 value={inputName}
                 onChange={(e) => setInputName(e.target.value)}
                 className="flex-1 text-sm font-bold text-slate-700 border-b border-slate-200 focus:border-yellow-400 outline-none px-2 py-0.5"
                 required
               />
            </div>
            <div className="flex gap-2">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`${activeTeam.label}に応援メッセージをどうぞ！`}
                className="flex-1 p-3 text-sm border-2 border-slate-100 rounded-xl focus:border-yellow-400 focus:ring-0 outline-none resize-none transition-all"
                rows={1}
                style={{ minHeight: '46px' }}
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="bg-yellow-400 text-slate-800 p-3 rounded-xl font-bold hover:bg-yellow-500 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all shadow-sm"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
