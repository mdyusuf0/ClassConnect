import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Video, VideoOff, Mic, MicOff, Settings, Users, 
  UserX, ShieldAlert, MessageSquare, Send, X, Play, Square, 
  Camera, Check, Upload, Sparkles, Volume2, VolumeX, Trash2
} from 'lucide-react';
import api from '../api/client';
import ImageUploader from './ImageUploader';

const LiveStudio = ({ session, onClose, onUpdateStatus, onReloadUsers }) => {
  const videoRef = useRef(null);
  
  // Stream state
  const [isLive, setIsLive] = useState(session?.status === 'live');
  const [duration, setDuration] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [streamMedia, setStreamMedia] = useState(null);

  // Live session chat settings state
  const [chatEnabled, setChatEnabled] = useState(session?.chatEnabled !== false);

  // Cover image
  const [coverImage, setCoverImage] = useState(session?.coverImage || '');
  const [showCoverModal, setShowCoverModal] = useState(false);

  // Settings & Devices
  const [showSettings, setShowSettings] = useState(false);
  const [videoDevices, setVideoDevices] = useState([]);
  const [audioDevices, setAudioDevices] = useState([]);
  const [selectedVideoDevice, setSelectedVideoDevice] = useState('');
  const [selectedAudioDevice, setSelectedAudioDevice] = useState('');

  // Participants & Moderation
  const [participants, setParticipants] = useState([]);

  // Chat
  const [chatMessages, setChatMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Timer effect for broadcast duration
  useEffect(() => {
    let timer;
    if (isLive) {
      timer = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    } else {
      setDuration(0);
    }
    return () => clearInterval(timer);
  }, [isLive]);

  // WebRTC Camera Setup
  useEffect(() => {
    initCameraStream();
    loadSessionDetailsAndChat();
    loadCourseAttendees();

    // Chat polling interval
    const pollInterval = setInterval(() => {
      loadSessionDetailsAndChat();
      loadCourseAttendees();
    }, 3000);

    return () => {
      stopCameraStream();
      clearInterval(pollInterval);
    };
  }, []);

  const loadSessionDetailsAndChat = async () => {
    if (!session?.sessionId) return;
    try {
      // Fetch dynamic messages
      const msgs = await api.getChatMessagesApi(session.sessionId);
      setChatMessages(msgs || []);

      // Fetch session status and chat settings
      const details = await api.getLiveSessionDetailApi(session.sessionId);
      if (details && details.session) {
        setChatEnabled(details.session.chatEnabled !== false);
        setIsLive(details.session.status === 'live');
      }
    } catch (err) {
      console.warn('Failed to load chat/session details:', err.message);
    }
  };

  const loadCourseAttendees = async () => {
    if (!session?.courseId) return;
    try {
      const allUsers = await api.getAdminUsersApi();
      // Filter students registered for this course
      const courseStudents = allUsers.filter(
        u => u.role === 'student' && u.enrolledCourses.includes(session.courseId)
      );
      setParticipants(courseStudents);
    } catch (err) {
      console.warn('Failed to load course attendees:', err.message);
    }
  };

  const initCameraStream = async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter(d => d.kind === 'videoinput');
      const audioDevs = devices.filter(d => d.kind === 'audioinput');
      setVideoDevices(videoDevs);
      setAudioDevices(audioDevs);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      });
      setStreamMedia(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (e) {
      console.warn('Camera access fallback or permission denied:', e);
    }
  };

  const stopCameraStream = () => {
    if (streamMedia) {
      streamMedia.getTracks().forEach(track => track.stop());
    }
  };

  const toggleCamera = () => {
    if (streamMedia) {
      const videoTrack = streamMedia.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !cameraOn;
      }
    }
    setCameraOn(!cameraOn);
  };

  const toggleMic = () => {
    if (streamMedia) {
      const audioTrack = streamMedia.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = micMuted;
      }
    }
    setMicMuted(!micMuted);
  };

  const handleStartBroadcast = async () => {
    try {
      await api.updateLiveStatusApi(session.sessionId, 'live');
      setIsLive(true);
      if (onUpdateStatus) {
        onUpdateStatus(session.sessionId, 'live');
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEndBroadcast = async () => {
    if (window.confirm('Are you sure you want to end this live broadcast? Recording will be stored to Bunny Stream.')) {
      try {
        await api.updateLiveStatusApi(session.sessionId, 'ended');
        setIsLive(false);
        if (onUpdateStatus) {
          onUpdateStatus(session.sessionId, 'ended');
        }
        onClose();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  // Moderation Controls
  const toggleUserSuspend = async (userId, currentSuspended) => {
    const action = currentSuspended ? 'Restore' : 'Suspend';
    if (window.confirm(`Are you sure you want to ${action} this student from the live class and platform?`)) {
      try {
        await api.toggleUserSuspensionApi(userId, !currentSuspended);
        alert(`Student has been ${currentSuspended ? 'Restored' : 'Suspended'} from the live broadcast.`);
        await loadCourseAttendees();
        if (onReloadUsers) onReloadUsers();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const toggleLiveChat = async () => {
    try {
      const nextChatState = !chatEnabled;
      await api.toggleLiveChatApi(session.sessionId, nextChatState);
      setChatEnabled(nextChatState);
      alert(`Chat has been ${nextChatState ? 'ENABLED' : 'DISABLED'} for students.`);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDeleteComment = async (messageId) => {
    if (window.confirm('Are you sure you want to delete this chat comment?')) {
      try {
        await api.deleteLiveChatMessageApi(session.sessionId, messageId);
        await loadSessionDetailsAndChat();
      } catch (err) {
        alert(err.message);
      }
    }
  };

  const handleSendChat = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      await api.sendChatMessageApi(session.sessionId, newMessage);
      setNewMessage('');
      await loadSessionDetailsAndChat();
    } catch (err) {
      alert(err.message);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveCoverImage = (newUrl) => {
    setCoverImage(newUrl);
    setShowCoverModal(false);
  };

  return (
    <div className="fixed inset-0 bg-[#0B0F19] text-white z-50 flex flex-col font-sans overflow-hidden">
      
      {/* Studio Header Bar */}
      <header className="bg-[#121827] border-b border-gray-800 px-6 py-3 flex items-center justify-between shadow-lg shrink-0">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isLive ? 'bg-red-500 animate-ping' : 'bg-gray-500'}`} />
            <span className={`px-2.5 py-1 rounded-full text-xs font-extrabold tracking-wider ${isLive ? 'bg-red-500/20 text-red-400 border border-red-500/40' : 'bg-gray-800 text-gray-400'}`}>
              {isLive ? '🔴 LIVE NOW' : '⚪ OFFLINE / READY'}
            </span>
          </div>

          <h2 className="font-heading font-extrabold text-base md:text-lg text-white truncate max-w-md">
            {session?.title || 'ClassConnect Live Broadcast Studio'}
          </h2>

          {isLive && (
            <span className="font-mono text-sm font-bold text-amber-400 bg-amber-500/10 px-3 py-1 rounded-lg border border-amber-500/20">
              {formatTimer(duration)}
            </span>
          )}
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowCoverModal(true)} 
            className="px-3 py-2 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-xl border border-gray-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Upload Live Class Cover Image"
          >
            <Upload size={14} className="text-amber-400" />
            <span className="hidden sm:inline">Cover Photo</span>
          </button>

          <button 
            onClick={() => setShowSettings(true)}
            className="p-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl border border-gray-700 transition-colors cursor-pointer"
            title="Camera & Mic Settings"
          >
            <Settings size={18} />
          </button>

          <button 
            onClick={onClose}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl border border-red-500/20 transition-colors cursor-pointer"
            title="Close Studio"
          >
            <X size={18} />
          </button>
        </div>
      </header>

      {/* Main Studio Viewport */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        
        {/* Main Stream Canvas & Camera Box */}
        <div className="flex-1 bg-black relative flex flex-col justify-between p-4 min-h-0">
          
          {/* Video Stream Screen */}
          <div className="relative flex-1 bg-gradient-to-b from-gray-900 to-black rounded-2xl border border-gray-800 overflow-hidden flex items-center justify-center shadow-2xl">
            
            {cameraOn ? (
              <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className="w-full h-full object-cover rounded-2xl" 
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center space-y-3">
                <div className="w-20 h-20 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center text-amber-400 shadow-inner">
                  <VideoOff size={36} />
                </div>
                <h3 className="font-heading font-extrabold text-lg text-gray-300">Camera is Turned Off</h3>
                <p className="text-xs text-gray-500 max-w-sm">Click the camera button below to enable video preview feed.</p>
              </div>
            )}

            <div className="absolute top-4 left-4 bg-gray-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-gray-800 text-xs flex items-center gap-1.5">
              <ShieldAlert size={14} className="text-amber-500" />
              <span className="font-semibold text-gray-300">RTMP/WebRTC Encryption Enabled</span>
            </div>
          </div>

          {/* Media Feed Controllers */}
          <div className="mt-4 bg-[#121827] border border-gray-800 rounded-2xl p-4 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-2">
              <button 
                onClick={toggleCamera}
                className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  cameraOn ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-red-500/20 text-red-500 border-red-500/30'
                }`}
                title={cameraOn ? 'Turn off camera' : 'Turn on camera'}
              >
                {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
              </button>

              <button 
                onClick={toggleMic}
                className={`p-3 rounded-xl border flex items-center justify-center transition-all cursor-pointer ${
                  !micMuted ? 'bg-gray-800 text-white border-gray-700 hover:bg-gray-700' : 'bg-red-500/20 text-red-500 border-red-500/30'
                }`}
                title={!micMuted ? 'Mute microphone' : 'Unmute microphone'}
              >
                {!micMuted ? <Mic size={18} /> : <MicOff size={18} />}
              </button>
            </div>

            <div className="flex items-center gap-2.5">
              {!isLive ? (
                <button 
                  onClick={handleStartBroadcast}
                  className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Play size={16} /> Go Live
                </button>
              ) : (
                <button 
                  onClick={handleEndBroadcast}
                  className="px-6 py-2.5 bg-gray-800 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 hover:border-red-600 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                >
                  <Square size={14} /> End Stream
                </button>
              )}
            </div>
          </div>

        </div>

        {/* Sidebar: Participants Control & Live Chat Panel */}
        <div className="w-full md:w-80 bg-[#121827] border-l border-gray-800 flex flex-col shrink-0 min-h-0">
          
          {/* Participants Control List */}
          <div className="p-4 border-b border-gray-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <Users size={16} className="text-amber-400" /> Connected Attendees ({participants.length})
              </h3>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {participants.map(p => (
                <div key={p.id || p._id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${p.isSuspended ? 'bg-red-500/10 border-red-500/30 text-gray-400 opacity-60' : 'bg-gray-800/60 border-gray-800 text-gray-200'}`}>
                  <div className="truncate pr-2">
                    <p className="font-bold truncate">{p.name}</p>
                    {p.isSuspended && <span className="text-[10px] text-red-400 font-extrabold uppercase">SUSPENDED</span>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => toggleUserSuspend(p.id || p._id, p.isSuspended)}
                      className={`p-1.5 rounded-lg transition-colors ${p.isSuspended ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700 hover:bg-red-500/20 hover:text-red-400 text-gray-400'}`}
                      title={p.isSuspended ? 'Restore User' : 'Suspend User'}
                    >
                      <UserX size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Live Chat Box */}
          <div className="flex-1 flex flex-col min-h-0 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
                <MessageSquare size={16} className="text-amber-400" /> Live Chat & Q&A
              </h3>
              
              {/* CHAT ENABLE/DISABLE SWITCH */}
              <button 
                onClick={toggleLiveChat}
                className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase transition-all border ${
                  chatEnabled 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' 
                    : 'bg-red-500/10 text-red-400 border-red-500/30 hover:bg-red-500/20'
                }`}
              >
                {chatEnabled ? 'Chat On' : 'Chat Off'}
              </button>
            </div>

            <div className="flex-1 bg-black/40 border border-gray-800 rounded-xl p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map(msg => (
                <div key={msg.messageId} className={`p-2 rounded-xl border space-y-1 ${msg.senderRole === 'admin' ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : 'bg-gray-800/40 border-gray-800 text-gray-300'}`}>
                  <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                    <span className={msg.senderRole === 'admin' ? 'text-amber-400 font-extrabold' : 'text-gray-300'}>{msg.senderName}</span>
                    <div className="flex items-center gap-2">
                      <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      
                      {/* DELETE COMMENT BUTTON */}
                      <button 
                        onClick={() => handleDeleteComment(msg.messageId)}
                        className="text-red-400 hover:text-red-500 p-0.5"
                        title="Delete comment"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  <p className="leading-snug">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="flex gap-2">
              <input 
                type="text" 
                placeholder="Announce or reply..." 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded-xl text-xs outline-none text-white focus:border-amber-500"
              />
              <button type="submit" className="p-2 bg-amber-500 hover:bg-amber-600 text-gray-950 font-bold rounded-xl shadow cursor-pointer">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Cover Image Upload Modal */}
      {showCoverModal && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121827] border border-gray-800 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-heading font-extrabold text-base text-white">Upload Live Masterclass Cover Image</h3>
              <button onClick={() => setShowCoverModal(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <ImageUploader 
              value={coverImage}
              onChange={handleSaveCoverImage}
              label="Select / Drag Live Cover Image"
              subfolder="live"
            />
          </div>
        </div>
      )}

      {/* Camera & Microphone Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#121827] border border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="font-heading font-extrabold text-base text-white">Camera & Mic Hardware Setup</h3>
              <button onClick={() => setShowSettings(false)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Camera Device Input</label>
                <select value={selectedVideoDevice} onChange={e => setSelectedVideoDevice(e.target.value)} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none">
                  {videoDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || `Camera ${d.deviceId.slice(0, 5)}`}</option>
                  ))}
                  {videoDevices.length === 0 && <option>Default System Camera</option>}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Microphone Device Input</label>
                <select value={selectedAudioDevice} onChange={e => setSelectedAudioDevice(e.target.value)} className="w-full px-3 py-2.5 bg-gray-800 border border-gray-700 rounded-xl text-white outline-none">
                  {audioDevices.map(d => (
                    <option key={d.deviceId} value={d.deviceId}>{d.label || `Microphone ${d.deviceId.slice(0, 5)}`}</option>
                  ))}
                  {audioDevices.length === 0 && <option>Default System Microphone</option>}
                </select>
              </div>
            </div>

            <button onClick={() => setShowSettings(false)} className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-gray-950 font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow">
              Apply Audio & Video Settings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default LiveStudio;
