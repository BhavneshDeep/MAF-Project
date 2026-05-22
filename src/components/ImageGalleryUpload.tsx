import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface ImageGalleryUploadProps {
  folder: 'events';
  value: string[];
  onChange: (urls: string[]) => void;
  label?: string;
}

export default function ImageGalleryUpload({ folder, value = [], onChange, label }: ImageGalleryUploadProps) {
  const [uploadingCount, setUploadingCount] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    const validFiles: File[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (!file.type.startsWith('image/')) {
        toast.error(`"${file.name}" is not an image.`);
        continue;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`"${file.name}" exceeds 5MB size limit.`);
        continue;
      }
      validFiles.push(file);
    }

    if (validFiles.length === 0) return;

    setUploadingCount(validFiles.length);
    const newUrls = [...value];
    let successCount = 0;
    let failCount = 0;

    // Upload in parallel
    await Promise.all(
      validFiles.map(async (file) => {
        try {
          const publicUrl = await api.uploadImage(file, folder);
          newUrls.push(publicUrl);
          successCount++;
        } catch (error: any) {
          console.error(error);
          failCount++;
        }
      })
    );

    setUploadingCount(0);
    onChange(newUrls);

    if (successCount > 0) {
      toast.success(`Successfully uploaded ${successCount} image(s) to gallery.`);
    }
    if (failCount > 0) {
      toast.error(`Failed to upload ${failCount} image(s). Ensure ngo-assets storage bucket is created.`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
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
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const updatedUrls = value.filter((_, idx) => idx !== indexToRemove);
    onChange(updatedUrls);
    toast.success('Image removed from gallery.');
  };

  return (
    <div className="space-y-4 text-left">
      {label && (
        <div className="flex justify-between items-center">
          <label className="text-xs font-bold text-gray-555 uppercase tracking-wider block">{label}</label>
          <span className="text-[10px] text-gray-400 font-bold">{value.length} Image(s) in Gallery</span>
        </div>
      )}

      {/* Grid of gallery previews */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {value.map((url, idx) => (
          <div
            key={url + '-' + idx}
            className="relative group aspect-square rounded-xl border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center"
          >
            <img
              src={url}
              alt={`Gallery Preview ${idx + 1}`}
              className="h-full w-full object-cover transition-all duration-300 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800';
              }}
            />
            {/* Overlay delete button on hover */}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <button
                type="button"
                onClick={() => handleRemoveImage(idx)}
                className="p-1.5 bg-red-650 hover:bg-red-750 text-white rounded-lg shadow-md transition-all duration-200 hover:scale-110"
                title="Remove image from gallery"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}

        {/* Uploading Placeholder Cards */}
        {uploadingCount > 0 &&
          Array.from({ length: uploadingCount }).map((_, idx) => (
            <div
              key={`uploading-${idx}`}
              className="aspect-square rounded-xl border border-dashed border-rose-350 bg-rose-50/5 flex flex-col items-center justify-center gap-1.5 p-2"
            >
              <Loader2 className="w-6 h-6 text-rose-600 animate-spin" />
              <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest text-center animate-pulse">
                Uploading...
              </span>
            </div>
          ))}

        {/* Browse Card in Grid */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`aspect-square border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all duration-300 flex flex-col items-center justify-center bg-gray-50/50 hover:bg-gray-50/80
            ${isDragOver ? 'border-rose-500 bg-rose-50/10' : 'border-gray-300 hover:border-rose-455'}`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="p-2 bg-white rounded-xl shadow-xs border border-gray-100 text-rose-500 mb-2">
            <Upload className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold text-gray-800 leading-tight">Add Images</span>
          <span className="text-[8px] text-gray-400 mt-1 uppercase font-black">Browse / Drop</span>
        </div>
      </div>
    </div>
  );
}
