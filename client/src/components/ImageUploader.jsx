import React, { useState, useEffect } from 'react';
import { Upload, Image as ImageIcon, X } from 'lucide-react';
import store from '../data/mockStore';

const ImageUploader = ({ value, onChange, label = 'Upload Image', subfolder = 'courses' }) => {
  const [preview, setPreview] = useState(value || '');

  useEffect(() => {
    setPreview(value || '');
  }, [value]);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result;
      setPreview(dataUrl);

      // Generate Bunny Storage CDN path for storage reference
      const cleanFileName = file.name.toLowerCase().replace(/[^a-z0-9.]/g, '-');
      const bunnyPath = store.formatBunnyStorageUrl(`${subfolder}/${cleanFileName}`, subfolder);

      // Pass dataUrl (or fallback bunnyPath) to parent state handler
      onChange(dataUrl || bunnyPath);
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider">{label}</label>
      
      <div className="relative group border-2 border-dashed border-gray-300 hover:border-amber-500 rounded-2xl p-4 bg-gray-50/80 hover:bg-amber-50/40 transition-all text-center flex flex-col items-center justify-center min-h-[130px]">
        {preview ? (
          <div className="relative w-full flex flex-col items-center justify-center">
            <img src={preview} alt="Uploaded Preview" className="h-28 max-w-full object-cover rounded-xl shadow-md border border-gray-200" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity rounded-xl">
              <label className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer shadow">
                Change Image
                <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
              </label>
              <button type="button" onClick={handleRemove} className="p-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow">
                <X size={16} />
              </button>
            </div>
          </div>
        ) : (
          <label className="w-full flex flex-col items-center justify-center cursor-pointer space-y-2 py-3">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 text-amber-600 flex items-center justify-center shadow-inner">
              <Upload size={20} />
            </div>
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-gray-800">Click to upload image file</p>
              <p className="text-[10px] text-gray-400 font-medium">Supports JPG, PNG, WEBP, GIF (Saved to Bunny Storage CDN)</p>
            </div>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUploader;
