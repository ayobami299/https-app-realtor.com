import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { Upload, Image as ImageIcon, Link2, RotateCcw, Check, Sparkles, AlertCircle } from 'lucide-react';

interface AvatarUploaderProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
  defaultAvatarSeed?: string;
  size?: 'sm' | 'md' | 'lg';
  idPrefix?: string;
}

const AVATAR_PRESETS = [
  {
    name: 'Modern Professional',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Tech Casual',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Executive Studio',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Creative Studio',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Urban Minimalist',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Artisan Portrait',
    url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Downtown Vibe',
    url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
  },
  {
    name: 'Warm Natural',
    url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80'
  }
];

export const AvatarUploader: React.FC<AvatarUploaderProps> = ({
  currentAvatar,
  onAvatarChange,
  defaultAvatarSeed,
  size = 'md',
  idPrefix = 'avatar'
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'presets' | 'url'>('upload');
  const [customUrlInput, setCustomUrlInput] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Helper to read and optionally downscale image to lightweight Base64
  const processImageFile = (file: File) => {
    setErrorMessage(null);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WebP, GIF).');
      return;
    }

    // Validate file size (max 8MB)
    if (file.size > 8 * 1024 * 1024) {
      setErrorMessage('Image size is too large (max 8MB). Please choose a smaller photo.');
      return;
    }

    setIsProcessing(true);
    const reader = new FileReader();

    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        setIsProcessing(false);
        setErrorMessage('Failed to read selected image.');
        return;
      }

      // Downscale if large using an off-screen canvas to maintain fast UI & DB storage
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 400; // 400x400 max avatar resolution is crisp for retina
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.88);
          onAvatarChange(compressedDataUrl);
        } else {
          onAvatarChange(result);
        }
        setIsProcessing(false);
      };

      img.onerror = () => {
        onAvatarChange(result);
        setIsProcessing(false);
      };

      img.src = result;
    };

    reader.onerror = () => {
      setIsProcessing(false);
      setErrorMessage('An error occurred while uploading the file.');
    };

    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processImageFile(files[0]);
    }
  };

  const handleApplyCustomUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const trimmed = customUrlInput.trim();
    if (!trimmed) return;

    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('data:image/')) {
      setErrorMessage('Please enter a valid URL starting with https://');
      return;
    }

    onAvatarChange(trimmed);
    setCustomUrlInput('');
  };

  const handleResetToDefault = () => {
    setErrorMessage(null);
    if (defaultAvatarSeed) {
      onAvatarChange(defaultAvatarSeed);
    } else {
      onAvatarChange(AVATAR_PRESETS[0].url);
    }
  };

  return (
    <div id={`${idPrefix}-uploader-container`} className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
          Profile Picture / Avatar
        </label>
        {defaultAvatarSeed && currentAvatar !== defaultAvatarSeed && (
          <button
            type="button"
            onClick={handleResetToDefault}
            id={`${idPrefix}-reset-avatar-btn`}
            className="text-[11px] font-semibold text-slate-500 hover:text-red-600 inline-flex items-center gap-1 transition cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to default</span>
          </button>
        )}
      </div>

      {/* Main Avatar Preview & Upload Trigger Area */}
      <div className="flex flex-col sm:flex-row items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        {/* Avatar Ring Preview */}
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-full ring-4 ring-red-500/20 border-2 border-red-500 overflow-hidden bg-slate-200 shadow-md flex items-center justify-center">
            {isProcessing ? (
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-red-600 border-t-transparent" />
            ) : (
              <img
                src={currentAvatar || defaultAvatarSeed || AVATAR_PRESETS[0].url}
                alt="Selected Profile Picture"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = AVATAR_PRESETS[0].url;
                }}
              />
            )}
          </div>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            id={`${idPrefix}-avatar-quick-upload-badge`}
            title="Upload new photo"
            aria-label="Upload photo"
            className="absolute -bottom-1 -right-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white p-1.5 rounded-full shadow-md transition cursor-pointer border-2 border-white"
          >
            <Upload className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Input Options & Controls */}
        <div className="flex-1 w-full space-y-2">
          {/* Method Sub-Tabs */}
          <div className="flex bg-slate-200/80 p-0.5 rounded-lg text-xs font-semibold text-slate-600 border border-slate-200">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              id={`${idPrefix}-tab-upload`}
              className={`flex-1 py-1 px-2 rounded-md transition cursor-pointer flex items-center justify-center gap-1 text-[11px] ${
                activeTab === 'upload' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Upload className="w-3 h-3" />
              <span>Upload Photo</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('presets')}
              id={`${idPrefix}-tab-presets`}
              className={`flex-1 py-1 px-2 rounded-md transition cursor-pointer flex items-center justify-center gap-1 text-[11px] ${
                activeTab === 'presets' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Presets Gallery</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              id={`${idPrefix}-tab-url`}
              className={`flex-1 py-1 px-2 rounded-md transition cursor-pointer flex items-center justify-center gap-1 text-[11px] ${
                activeTab === 'url' ? 'bg-white text-red-600 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              <Link2 className="w-3 h-3" />
              <span>Image URL</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/jpg, image/webp, image/gif"
            className="hidden"
            id={`${idPrefix}-hidden-file-input`}
          />

          {/* Tab 1: Drag & Drop File Upload Area */}
          {activeTab === 'upload' && (
            <div
              id={`${idPrefix}-drag-drop-zone`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1 ${
                isDragging
                  ? 'border-red-500 bg-red-50/80 scale-[1.01]'
                  : 'border-slate-300 hover:border-red-400 bg-white hover:bg-red-50/20'
              }`}
            >
              <div className="w-7 h-7 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs font-semibold text-slate-800">
                {isDragging ? 'Drop your photo here!' : 'Click to browse or drag & drop photo'}
              </p>
              <span className="text-[10px] text-slate-500">
                Supports PNG, JPG, WebP or GIF up to 8MB
              </span>
            </div>
          )}

          {/* Tab 2: Gallery of Avatars */}
          {activeTab === 'presets' && (
            <div className="space-y-1.5">
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
                {AVATAR_PRESETS.map((preset, idx) => {
                  const isSelected = currentAvatar === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => onAvatarChange(preset.url)}
                      id={`${idPrefix}-preset-avatar-${idx}`}
                      title={preset.name}
                      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full overflow-hidden border-2 transition cursor-pointer ${
                        isSelected
                          ? 'border-red-600 ring-2 ring-red-500/30 scale-105 shadow-sm'
                          : 'border-slate-200 hover:border-slate-400 opacity-80 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                      {isSelected && (
                        <div className="absolute inset-0 bg-red-600/30 flex items-center justify-center">
                          <Check className="w-3 h-3 text-white stroke-[3]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
              <p className="text-[10px] text-slate-500 text-center">Click any avatar to apply instantly</p>
            </div>
          )}

          {/* Tab 3: Direct Web Image URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyCustomUrl} className="flex gap-1.5">
              <input
                type="url"
                value={customUrlInput}
                onChange={(e) => setCustomUrlInput(e.target.value)}
                placeholder="https://example.com/my-photo.jpg"
                className="flex-1 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-900 bg-white outline-hidden focus:border-red-500 focus:ring-1 focus:ring-red-500/20"
              />
              <button
                type="submit"
                id={`${idPrefix}-apply-url-btn`}
                disabled={!customUrlInput.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer"
              >
                Apply
              </button>
            </form>
          )}

          {/* Error feedback if any */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-red-600 bg-red-50 p-2 rounded-lg border border-red-200">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
