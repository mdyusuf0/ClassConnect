import React, { useState, useEffect } from 'react';
import { 
  Radio, Play, Volume2, VolumeX, MessageSquare, 
  Send, X, Sparkles, Hand, Heart, ThumbsUp, ShieldCheck, Award
} from 'lucide-react';
import store from '../data/mockStore';

const LiveViewer = ({ session, onClose, currentUser }) => {
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', sender: 'System', text: 'Welcome to ClassConnect Live Masterclass Workspace!', time: 'Just now', isSystem: true },
    { id: 'm2', sender: 'ClassConnect Instructor', text: 'Today we will build & deploy live production features.', time: '1m ago', isHost: true },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const [handRaised, setHandRaised] = useState(false);
  const [reactions, setReactions] = useState([]);

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const msg = {
      id: 'msg-' + Date.now(),
      sender: currentUser?.name || 'Student',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHost: false
    };

    setChatMessages(prev => [...prev, msg]);
    setNewMessage('');
  };

  const handleToggleHandRaise = () => {
    setHandRaised(!handRaised);
    const text = !handRaised ? 'raised hand ✋' : 'lowered hand';
    const sysMsg = {
      id: 'sys-' + Date.now(),
      sender: 'System',
      text: `${currentUser?.name || 'Student'} ${text}.`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSystem: true
    };
    setChatMessages(prev => [...prev, sysMsg]);
  };

  const triggerReaction = (emoji) => {
    const newId = Date.now();
    setReactions(prev => [...prev, { id: newId, emoji }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== newId));
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-[#001845] text-white z-50 flex flex-col font-sans overflow-hidden">
      
      {/* Top Navigation Bar */}
      <header className="bg-[#001233] border-b border-white/10 px-6 py-3.5 flex items-center justify-between shadow-xl shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${session?.status === 'LIVE_NOW' ? 'bg-red-500 animate-ping' : 'bg-amber-400'}`} />
            <span className={`px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase ${
              session?.status === 'LIVE_NOW' ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}>
              {session?.status === 'LIVE_NOW' ? '🔴 LIVE NOW' : '⚪ UPCOMING MASTERCLASS'}
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-base md:text-lg text-white truncate max-w-md">
            {session?.title || 'ClassConnect Live Masterclass'}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl border border-white/20 transition-all cursor-pointer"
            title="Leave Live Class"
          >
            <X size={20} />
          </button>
        </div>
      </header>

      {/* Main Studio Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 relative">
        
        {/* Animated Reactions Overlay */}
        <div className="absolute bottom-20 left-10 z-40 pointer-events-none space-y-2">
          {reactions.map(r => (
            <div key={r.id} className="text-3xl animate-bounce">
              {r.emoji}
            </div>
          ))}
        </div>

        {/* Left Side Stream Player */}
        <div className="flex-1 bg-black p-4 flex flex-col justify-between relative min-h-0">
          <div className="relative flex-1 bg-gradient-to-b from-gray-950 to-black rounded-3xl border border-white/10 overflow-hidden flex items-center justify-center shadow-2xl">
            {session?.videoUrl || session?.streamUrl ? (
              <iframe
                src={session.videoUrl || session.streamUrl || 'https://www.youtube.com/embed/dQw4w9WgXcQ'}
                title={session.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                <div className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-amber-400 shadow-2xl">
                  <Radio size={36} className="animate-pulse" />
                </div>
                <h3 className="font-heading font-extrabold text-2xl text-white">Live Broadcast Starting Shortly</h3>
                <p className="text-xs text-gray-300 max-w-md">
                  Instructor <strong className="text-amber-400">{session?.instructor || 'PRO Mentors'}</strong> is preparing the live studio feed.
                </p>
              </div>
            )}

            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <ShieldCheck size={14} className="text-emerald-400" />
              <span className="font-semibold text-gray-200">100% Encrypted Stream</span>
            </div>
          </div>

          {/* Student Interaction Controls */}
          <div className="mt-4 bg-[#001233] border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleToggleHandRaise}
                className={`px-4 py-2.5 rounded-xl font-heading font-extrabold text-xs uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-md ${
                  handRaised ? 'bg-amber-500 text-gray-950 shadow-amber-500/30' : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
                }`}
              >
                <Hand size={16} />
                <span>{handRaised ? 'Hand Raised ✋' : 'Raise Hand'}</span>
              </button>
            </div>

            {/* Reaction Emojis */}
            <div className="flex items-center gap-2">
              {['👏', '🔥', '❤️', '🎉'].map(emoji => (
                <button
                  key={emoji}
                  onClick={() => triggerReaction(emoji)}
                  className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-lg flex items-center justify-center transition-transform active:scale-90 cursor-pointer"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Chat & Q&A Panel */}
        <div className="w-full md:w-88 bg-[#001233] border-l border-white/10 flex flex-col shrink-0 min-h-0 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-amber-400 flex items-center gap-2">
              <MessageSquare size={16} /> Live Q&A Chat
            </h3>
            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded-full text-gray-300 font-mono">Bilingual Room</span>
          </div>

          <div className="flex-1 bg-black/40 border border-white/10 rounded-2xl p-3 overflow-y-auto space-y-2.5 text-xs">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`p-2.5 rounded-xl border space-y-1 ${msg.isHost ? 'bg-amber-500/20 border-amber-500/40 text-amber-200' : msg.isSystem ? 'bg-white/5 border-white/10 text-gray-400 text-center italic' : 'bg-white/10 border-white/10 text-gray-200'}`}>
                {!msg.isSystem && (
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <span className={msg.isHost ? 'text-amber-400 font-extrabold' : 'text-gray-300'}>{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                )}
                <p className="leading-relaxed">{msg.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSendChat} className="flex gap-2">
            <input 
              type="text" 
              placeholder="Ask a question..." 
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-white/10 border border-white/20 rounded-xl text-xs outline-none text-white focus:border-amber-400 placeholder:text-gray-400"
            />
            <button type="submit" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow cursor-pointer">
              <Send size={15} />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};

export default LiveViewer;
