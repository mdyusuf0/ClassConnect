import React, { useState, useEffect } from 'react';
import { Upload, Video, Image as ImageIcon, X, Play, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import api from '../api/client';

const MediaUploader = ({ 
  value, 
  onChange, 
  label = 'Upload Media File', 
  type = 'all', // 'image' | 'video' | 'all'
  subfolder = 'media'
}) => {
  const [preview, setPreview] = useState(value || '');
  const [isVideo, setIsVideo] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setPreview(value || '');
    if (value && (value.endsWith('.mp4') || value.endsWith('.webm') || value.includes('video') || value.includes('youtube') || value.includes('b-cdn.net'))) {
      setIsVideo(true);
    } else {
      setIsVideo(false);
    }
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError('');
    setUploading(true);

    // Security & File Size Check (100MB max limit)
    const MAX_SIZE = 100 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      setError('File size exceeds 100MB security limit. Please choose a smaller file.');
      setUploading(false);
      return;
    }

    const isVideoFile = file.type.startsWith('video/');
    setIsVideo(isVideoFile);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);

      try {
        const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
        const folder = isVideoFile ? 'videos' : 'thumbnails';
        
        // Upload via backend proxy to Bunny
        const result = await api.uploadAssetApi(dataUrl, cleanFileName, folder);
        
        // Set actual Bunny CDN URL returned
        const bunnyUrl = result.cdnUrl || result.url;
        onChange(bunnyUrl);
        setPreview(bunnyUrl);
      } catch (err) {
        console.warn('Bunny CDN upload failed:', err.message);
        setError('Bunny CDN Upload failed. Using local preview fallback.');
        onChange(dataUrl);
      } finally {
        setUploading(false);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    setIsVideo(false);
    setError('');
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[10px] text-gray-400 font-normal">Supports Images & Videos</span>
      </label>

      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-1.5 font-semibold">
          <AlertCircle size={14} className="flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="relative group border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-2xl p-4 bg-gray-50/90 hover:bg-amber-50/40 transition-all text-center flex flex-col items-center justify-center min-h-[140px]">
        {uploading ? (
          <div className="flex flex-col items-center justify-center space-y-2 py-4">
            <Loader2 className="w-8 h-8 text-amber-500 animate-spin" />
            <p className="text-xs font-bold text-gray-700">Uploading file to Bunny Storage CDN...</p>
          </div>
        ) : preview ? (
          <div className="relative w-full flex flex-col items-center justify-center">
            {isVideo ? (
              <div className="w-full max-h-48 rounded-xl overflow-hidden bg-black shadow-md border border-gray-200 relative">
                <video 
                  src={preview} 
                  controls 
                  className="w-full max-h-48 object-contain rounded-xl"
                />
              </div>
            ) : (
              <img 
                src={preview} 
                alt="Media Preview" 
                className="h-32 max-w-full object-cover rounded-xl shadow-md border border-gray-200" 
              />
            )}

            <div className="mt-3 flex items-center gap-2">
              <label className="px-3.5 py-1.5 bg-[#001845] hover:bg-[#002B70] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer shadow-md transition-all">
                Change File
                <input 
                  type="file" 
                  accept={type === 'video' ? 'video/*' : type === 'image' ? 'image/*' : 'image/*,video/*'} 
                  className="hidden" 
                  onChange={handleFileChange} 
                />
              </label>
              <button 
                type="button" 
                onClick={handleRemove} 
                className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-md transition-colors"
                title="Remove Media"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <label className="w-full flex flex-col items-center justify-center cursor-pointer space-y-2 py-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
              {type === 'video' ? <Video size={24} /> : <Upload size={24} />}
            </div>
            <div className="space-y-1">
              <p className="text-xs font-extrabold text-gray-800">Click to upload media file or drag & drop</p>
              <p className="text-[10px] text-gray-400 font-medium">Supports MP4, WEBM, MOV, JPG, PNG, WEBP (Max 100MB)</p>
            </div>
            <input 
              type="file" 
              accept={type === 'video' ? 'video/*' : type === 'image' ? 'image/*' : 'image/*,video/*'} 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default MediaUploader;
