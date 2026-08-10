import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getLiveSessionDetailApi, getChatMessagesApi, sendChatMessageApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import logger from '../utils/logger';
import { Radio, Send, MessageSquare, Shield, User, ArrowLeft, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';

export default function LiveRoom() {
  const { sessionId } = useParams();
  const { user } = useAuth();

  const [session, setSession] = useState(null);
  const [streamUrl, setStreamUrl] = useState('');
  const [messages, setMessages] = useState([]);
  const [chatText, setChatText] = useState('');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sending, setSending] = useState(false);

  const chatEndRef = useRef(null);

  const fetchSessionData = async () => {
    try {
      const res = await getLiveSessionDetailApi(sessionId);
      if (res.success && res.session) {
        setSession(res.session);
        setStreamUrl(res.streamUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4');
      }
    } catch (err) {
      setError(err.message || 'Failed to load live room session');
    } finally {
      setLoading(false);
    }
  };

  const fetchChat = async () => {
    try {
      const res = await getChatMessagesApi(sessionId);
      if (res.success && res.messages) {
        setMessages(res.messages);
      }
    } catch (err) {
      logger.warn('Live chat fetch warning:', err);
    }
  };

  useEffect(() => {
    fetchSessionData();
    fetchChat();

    // Auto-poll live chat every 3 seconds
    const interval = setInterval(fetchChat, 3000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!chatText.trim()) return;
    setSending(true);

    try {
      const res = await sendChatMessageApi(sessionId, { text: chatText });
      if (res.success && res.chatMessage) {
        setMessages((prev) => [...prev, res.chatMessage]);
        setChatText('');
      }
    } catch (err) {
      setError('Send chat failed: ' + err.message);
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-red-500"></span>
      </div>
    );
  }

  const isLive = session?.status === 'live';
  const isEnded = session?.status === 'ended';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Header Bar */}
      <div className="bg-slate-900/90 border-b border-white/10 px-6 py-4 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link to="/dashboard" className="btn btn-circle btn-ghost btn-sm text-slate-400 hover:text-white">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className={`badge badge-sm font-bold uppercase text-[10px] gap-1 ${
                isLive ? 'badge-error text-white animate-pulse' : isEnded ? 'badge-success' : 'badge-primary'
              }`}>
                <Radio className="w-3 h-3" /> {isLive ? 'LIVE NOW' : isEnded ? 'ENDED' : 'SCHEDULED'}
              </span>
              <h1 className="text-lg font-bold text-white leading-tight">{session?.title}</h1>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{session?.description || 'Interactive Q&A Session'}</p>
          </div>
        </div>
      </div>

      {isEnded && (
        <div className="bg-emerald-950/80 border-b border-emerald-500/30 p-4 px-6 text-emerald-300 text-xs flex items-center justify-between">
          <span className="font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Session Ended — Recording automatically converted to regular course lesson!
          </span>
          <Link to={`/learn/${session?.courseId}`} className="btn btn-xs btn-primary gap-1">
            <BookOpen className="w-3 h-3" /> Go to Classroom
          </Link>
        </div>
      )}

      {/* Main Live Room & Chat Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3">
        {/* Left Column: Live Video Stream Player */}
        <div className="lg:col-span-2 p-6 space-y-4 bg-slate-950 border-r border-white/10">
          <div className="aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 shadow-2xl relative">
            <video
              src={streamUrl}
              controls
              autoPlay
              className="w-full h-full object-contain"
            />
            {isLive && (
              <div className="absolute top-4 left-4 badge badge-error text-white font-bold gap-1 animate-pulse shadow-lg">
                <Radio className="w-3 h-3" /> LIVE ROOM STREAM
              </div>
            )}
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-white/10 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Host & Session Notes:</span>
            <p>Participate in real-time chat on the right panel. All live class recordings are converted into recorded course lessons upon session conclusion.</p>
          </div>
        </div>

        {/* Right Column: Real-Time Live Chat Sidebar */}
        <div className="p-6 bg-slate-900/40 flex flex-col justify-between max-h-[85vh]">
          <div className="space-y-4 flex-1 flex flex-col">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-400" /> Real-Time Live Chat
              </h3>
              <span className="badge badge-xs badge-neutral">{messages.length} messages</span>
            </div>

            {/* Chat Messages Scroll Window */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-2 max-h-[55vh]">
              {messages.map((msg, idx) => {
                const isAdmin = msg.senderRole === 'admin';
                return (
                  <div
                    key={msg.messageId || idx}
                    className={`p-3 rounded-xl border text-xs space-y-1 ${
                      isAdmin
                        ? 'bg-purple-950/40 border-purple-500/30 text-purple-200'
                        : 'bg-slate-900/60 border-white/5 text-slate-300'
                    }`}
                  >
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="font-bold text-white flex items-center gap-1">
                        {isAdmin ? <Shield className="w-3 h-3 text-purple-400" /> : <User className="w-3 h-3 text-indigo-400" />}
                        {msg.senderName}
                      </span>
                      <span className="text-slate-500 font-mono">
                        {new Date(msg.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="leading-snug">{msg.text}</p>
                  </div>
                );
              })}
              <div ref={chatEndRef} />
            </div>
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendChat} className="pt-4 border-t border-white/10 flex gap-2">
            <input
              type="text"
              required
              value={chatText}
              onChange={(e) => setChatText(e.target.value)}
              placeholder={isLive ? 'Type a question or message...' : 'Chat enabled...'}
              className="input input-bordered input-sm flex-1 bg-slate-900 text-white text-xs border-white/10"
            />
            <button
              type="submit"
              disabled={sending}
              className="btn btn-sm bg-indigo-600 hover:bg-indigo-700 text-white border-0"
            >
              {sending ? <span className="loading loading-spinner loading-xs"></span> : <Send className="w-3.5 h-3.5" />}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
