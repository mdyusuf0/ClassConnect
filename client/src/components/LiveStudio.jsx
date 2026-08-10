import React, { useState, useEffect, useRef } from 'react';
import { 
  Radio, Video, VideoOff, Mic, MicOff, Settings, Users, 
  UserX, ShieldAlert, MessageSquare, Send, X, Play, Square, 
  Camera, Check, Upload, Sparkles, Volume2, VolumeX
} from 'lucide-react';
import store from '../data/mockStore';
import ImageUploader from './ImageUploader';

const LiveStudio = ({ session, onClose, onUpdateStatus }) => {
  const videoRef = useRef(null);
  
  // Stream state
  const [isLive, setIsLive] = useState(session?.status === 'LIVE_NOW');
  const [duration, setDuration] = useState(0);
  const [cameraOn, setCameraOn] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [streamMedia, setStreamMedia] = useState(null);

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
  const [participants, setParticipants] = useState([
    { id: 'u1', name: 'Alex Johnson (Student)', isMicMuted: true, isCameraOff: true, isSuspended: false, role: 'student' },
    { id: 'u2', name: 'Bella Smith (Student)', isMicMuted: false, isCameraOff: true, isSuspended: false, role: 'student' },
    { id: 'u3', name: 'Charlie Davis (Student)', isMicMuted: true, isCameraOff: false, isSuspended: false, role: 'student' },
    { id: 'u4', name: 'Divya Sharma (Student)', isMicMuted: true, isCameraOff: true, isSuspended: false, role: 'student' },
  ]);

  // Chat
  const [chatMessages, setChatMessages] = useState([
    { id: 'm1', sender: 'System', text: 'Welcome to the Live Masterclass Broadcast Studio!', time: 'Just now', isSystem: true },
    { id: 'm2', sender: 'Alex Johnson', text: 'Hello Sir, excited for today’s session!', time: '1m ago' },
  ]);
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
    return () => {
      stopCameraStream();
    };
  }, []);

  const initCameraStream = async () => {
    try {
      // List media devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevs = devices.filter(d => d.kind === 'videoinput');
      const audioDevs = devices.filter(d => d.kind === 'audioinput');
      setVideoDevices(videoDevs);
      setAudioDevices(audioDevs);

      // Request stream
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

  const handleStartBroadcast = () => {
    setIsLive(true);
    if (session && onUpdateStatus) {
      onUpdateStatus(session.id, 'LIVE_NOW');
    }
  };

  const handleEndBroadcast = () => {
    if (window.confirm('Are you sure you want to end this live broadcast? Recording will be stored to Bunny Stream.')) {
      setIsLive(false);
      if (session && onUpdateStatus) {
        onUpdateStatus(session.id, 'COMPLETED');
      }
    }
  };

  // Moderation Controls
  const toggleUserMic = (id) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, isMicMuted: !p.isMicMuted } : p
    ));
  };

  const toggleUserCamera = (id) => {
    setParticipants(participants.map(p => 
      p.id === id ? { ...p, isCameraOff: !p.isCameraOff } : p
    ));
  };

  const toggleUserSuspend = (id) => {
    setParticipants(participants.map(p => {
      if (p.id === id) {
        const nextState = !p.isSuspended;
        alert(`${p.name} has been ${nextState ? 'Temporarily Suspended' : 'Restored'} from the live broadcast.`);
        return { ...p, isSuspended: nextState };
      }
      return p;
    }));
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    const msg = {
      id: 'msg-' + Date.now(),
      sender: 'Host / Instructor',
      text: newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isHost: true
    };
    setChatMessages([...chatMessages, msg]);
    setNewMessage('');
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSaveCoverImage = (newUrl) => {
    setCoverImage(newUrl);
    if (session) {
      session.coverImage = newUrl;
      store.updateLiveSessionStatus(session.id, session.status);
    }
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

            {/* Broadcast Overlay Info */}
            <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs">
              <span className="font-semibold text-gray-300">Bunny Stream CDN:</span>
              <code className="text-amber-400 font-mono">vz-e90d4726-817.b-cdn.net</code>
            </div>

            {/* Mic Status Watermark */}
            <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-xs flex items-center gap-2">
              {micMuted ? (
                <span className="text-red-400 font-bold flex items-center gap-1"><MicOff size={14} /> Mic Muted</span>
              ) : (
                <span className="text-emerald-400 font-bold flex items-center gap-1"><Mic size={14} /> Audio Active</span>
              )}
            </div>
          </div>

          {/* Bottom Broadcast Control Toolbar */}
          <div className="mt-4 bg-[#121827] border border-gray-800 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 shadow-xl">
            
            <div className="flex items-center gap-3">
              {/* Camera Toggle */}
              <button 
                onClick={toggleCamera}
                className={`p-3 rounded-xl flex items-center gap-2 font-bold text-xs transition-all shadow-md cursor-pointer ${
                  cameraOn ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {cameraOn ? <Video size={18} /> : <VideoOff size={18} />}
                <span className="hidden sm:inline">{cameraOn ? 'Cam ON' : 'Cam OFF'}</span>
              </button>

              {/* Mic Toggle */}
              <button 
                onClick={toggleMic}
                className={`p-3 rounded-xl flex items-center gap-2 font-bold text-xs transition-all shadow-md cursor-pointer ${
                  !micMuted ? 'bg-gray-800 hover:bg-gray-700 text-white border border-gray-700' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}
              >
                {!micMuted ? <Mic size={18} /> : <MicOff size={18} />}
                <span className="hidden sm:inline">{!micMuted ? 'Mic Active' : 'Mic Muted'}</span>
              </button>
            </div>

            {/* Start / End Broadcast CTA */}
            <div>
              {!isLive ? (
                <button 
                  onClick={handleStartBroadcast}
                  className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg flex items-center gap-2 transition-all cursor-pointer animate-bounce"
                >
                  <Radio size={18} />
                  <span>Start Live Broadcast</span>
                </button>
              ) : (
                <button 
                  onClick={handleEndBroadcast}
                  className="px-6 py-3 bg-gray-800 hover:bg-black text-white font-heading font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-lg border border-red-500/50 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Square size={16} className="text-red-500" />
                  <span>End Stream & Save Recording</span>
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
                <div key={p.id} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${p.isSuspended ? 'bg-red-500/10 border-red-500/30 text-gray-400 opacity-60' : 'bg-gray-800/60 border-gray-800 text-gray-200'}`}>
                  <div className="truncate pr-2">
                    <p className="font-bold truncate">{p.name}</p>
                    {p.isSuspended && <span className="text-[10px] text-red-400 font-extrabold uppercase">SUSPENDED</span>}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button 
                      onClick={() => toggleUserMic(p.id)}
                      className={`p-1.5 rounded-lg transition-colors ${p.isMicMuted ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}
                      title={p.isMicMuted ? 'Unmute Mic' : 'Mute Mic'}
                    >
                      {p.isMicMuted ? <MicOff size={13} /> : <Mic size={13} />}
                    </button>
                    <button 
                      onClick={() => toggleUserCamera(p.id)}
                      className={`p-1.5 rounded-lg transition-colors ${p.isCameraOff ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}
                      title={p.isCameraOff ? 'Enable Camera' : 'Disable Camera'}
                    >
                      {p.isCameraOff ? <VideoOff size={13} /> : <Video size={13} />}
                    </button>
                    <button 
                      onClick={() => toggleUserSuspend(p.id)}
                      className={`p-1.5 rounded-lg transition-colors ${p.isSuspended ? 'bg-amber-500/20 text-amber-400' : 'bg-gray-700 hover:bg-red-500/20 hover:text-red-400 text-gray-400'}`}
                      title={p.isSuspended ? 'Restore User' : 'Temp Suspend User'}
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
            <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-gray-400 flex items-center gap-2">
              <MessageSquare size={16} className="text-amber-400" /> Live Chat & Q&A
            </h3>

            <div className="flex-1 bg-black/40 border border-gray-800 rounded-xl p-3 overflow-y-auto space-y-2.5 text-xs">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`p-2 rounded-xl border space-y-1 ${msg.isHost ? 'bg-amber-500/10 border-amber-500/30 text-amber-200' : msg.isSystem ? 'bg-gray-800/80 border-gray-700 text-gray-400 text-center italic' : 'bg-gray-800/40 border-gray-800 text-gray-300'}`}>
                  {!msg.isSystem && (
                    <div className="flex items-center justify-between text-[10px] font-bold text-gray-400">
                      <span className={msg.isHost ? 'text-amber-400 font-extrabold' : 'text-gray-300'}>{msg.sender}</span>
                      <span>{msg.time}</span>
                    </div>
                  )}
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
