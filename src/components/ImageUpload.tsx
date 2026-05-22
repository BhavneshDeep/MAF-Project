import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  folder: 'team' | 'collaborators' | 'events' | 'projects';
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ folder, value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Selected file must be an image.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB.');
      return;
    }

    try {
      setIsUploading(true);
      const publicUrl = await api.uploadImage(file, folder);
      onChange(publicUrl);
      toast.success('Image uploaded successfully to Supabase Storage.');
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'Image upload failed. Please verify your Supabase configuration.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2 text-left">
      {label && <label className="text-xs font-bold text-gray-550 uppercase tracking-wider block">{label}</label>}

      {value ? (
        // Preview State
        <div className="relative group rounded-xl border border-gray-250 overflow-hidden bg-gray-50 h-44 flex items-center justify-center">
          <img
            src={value}
            alt="Uploaded Preview"
            className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
            }}
          />
          {/* Blur overlay on hover */}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
            <button
              type="button"
              onClick={handleRemove}
              className="p-2 bg-red-600 hover:bg-red-750 text-white rounded-xl shadow-lg transition-transform duration-250 hover:scale-110 flex items-center gap-1.5 text-xs font-bold"
            >
              <X className="w-4 h-4" />
              <span>Remove Image</span>
            </button>
          </div>
        </div>
      ) : (
        // Upload Button / Drag Area
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center min-h-[11rem] bg-gray-50/50 hover:bg-gray-50/80
            ${isDragOver ? 'border-rose-500 bg-rose-50/10' : 'border-gray-300 hover:border-rose-400'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {isUploading ? (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex flex-col items-center justify-center gap-2.5 z-10 rounded-xl">
              <Loader2 className="w-8 h-8 text-rose-600 animate-spin" />
              <p className="text-xs font-bold text-gray-700 animate-pulse">Uploading to Supabase...</p>
            </div>
          ) : (
            <div className="space-y-2 flex flex-col items-center">
              <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-rose-500">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-800">
                  Click to <span className="text-rose-600 hover:underline">browse</span> or drag image here
                </p>
                <p className="text-[10px] text-gray-400 mt-1 font-medium">
                  Supports PNG, JPG, JPEG, WEBP (Max 5MB)
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
