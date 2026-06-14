import React, { useState, useRef } from 'react';
import { Camera, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploadProps {
  label: string;
  onImageChange: (file: File | null) => void;
  required?: boolean;
}

export function ImageUpload({ label, onImageChange, required = false }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      onImageChange(null);
      setPreview(null);
    }
  };

  const clearImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setPreview(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <label className="text-[10px] text-slate-500 dark:text-gray-400 font-bold uppercase tracking-widest block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      
      <div 
        className={`relative w-full rounded-xl border-2 border-dashed flex flex-col items-center justify-center transition-all overflow-hidden ${preview ? 'border-purple-500 bg-black/50' : 'border-gray-600 bg-gray-900/50 hover:bg-gray-800'}`}
        style={{ minHeight: '120px' }}
        onClick={() => !preview && fileInputRef.current?.click()}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="absolute inset-0 w-full h-full object-cover opacity-80" />
            <button 
              onClick={clearImage}
              className="absolute top-2 right-2 bg-black/70 rounded-full p-1 text-slate-800 dark:text-white hover:bg-red-500 transition-colors z-10"
              type="button"
            >
              <X className="w-5 h-5" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-6 gap-3 text-slate-500 dark:text-gray-400 cursor-pointer">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow-inner">
                <Camera className="w-5 h-5 text-purple-400" />
              </div>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center shadow-inner">
                <ImageIcon className="w-5 h-5 text-blue-400" />
              </div>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-center px-4">
              Toca para tomar foto <br/> o subir archivo
            </span>
          </div>
        )}
        
        <input 
          type="file"
          ref={fileInputRef}
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  );
}
