import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon, Sparkles } from 'lucide-react';
import { storageService } from '../firebase';

// Helper to compress and convert image file to Base64
const compressAndConvertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1000;
        const MAX_HEIGHT = 1000;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string); // fallback to original base64 if canvas context fails
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Compress to JPEG with 0.7 quality to balance size and quality (aiming under 100kb for Firestore compatibility)
        const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
        resolve(compressedBase64);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
};

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  onRemove?: () => void;
  currentImageUrl?: string;
  folder?: string;
  label?: string;
  className?: string;
}

export default function ImageUpload({ 
  onUploadComplete, 
  onRemove, 
  currentImageUrl, 
  folder = "uploads",
  label = "Imagem",
  className = ""
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCompatibilityMode, setIsCompatibilityMode] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Basic validation
    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione um arquivo de imagem.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      setError("A imagem deve ter menos de 5MB.");
      return;
    }

    try {
      setIsUploading(true);
      setError(null);
      setIsCompatibilityMode(false);
      
      try {
        const url = await storageService.uploadFile(file, folder);
        onUploadComplete(url);
      } catch (storageErr) {
        console.warn("Firebase Storage upload failed (CORS or permissions). Falling back to optimized Base64 format:", storageErr);
        
        // Dynamic compression and convert to Base64 to bypass CORS completely
        const compressedUrl = await compressAndConvertToBase64(file);
        setIsCompatibilityMode(true);
        onUploadComplete(compressedUrl);
      }
    } catch (err) {
      console.error("Upload/Compression failed:", err);
      setError("Falha ao processar a imagem. Tente outro arquivo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) return;
    
    try {
      // Optional: Delete from storage when removed from UI (skip if it's base64 data)
      if (!currentImageUrl.startsWith('data:')) {
        await storageService.deleteFile(currentImageUrl);
      }
      if (onRemove) {
        onRemove();
      }
    } catch (err) {
      console.error("Error deleting file:", err);
      // Even if delete fails (e.g. CORS or already deleted), remove from UI
      if (onRemove) {
        onRemove();
      }
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && (
        <label className="block font-accent text-[10px] font-bold text-[#8A96A3] uppercase tracking-widest">
          {label}
        </label>
      )}
      
      <div className="relative group">
        {currentImageUrl ? (
          <div className="relative aspect-video rounded overflow-hidden border border-white/10 bg-[#0D1B2A]">
            <img 
              src={currentImageUrl} 
              alt="Preview" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors"
                title="Trocar imagem"
              >
                <Upload className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleRemove}
                className="p-2 bg-red-500/20 hover:bg-red-500/40 rounded-full text-red-400 transition-colors"
                title="Remover imagem"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="w-full aspect-video flex flex-col items-center justify-center gap-3 rounded border border-dashed border-white/20 bg-[#132033]/40 hover:bg-[#132033]/60 hover:border-[#E8711A]/40 transition-all group disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-8 h-8 text-[#E8711A] animate-spin" />
                <span className="text-[10px] font-accent uppercase tracking-widest text-[#8A96A3]">Subindo...</span>
              </>
            ) : (
              <>
                <div className="p-3 rounded-full bg-white/5 group-hover:bg-[#E8711A]/10 transition-colors">
                  <ImageIcon className="w-6 h-6 text-[#8A96A3] group-hover:text-[#E8711A]" />
                </div>
                <div className="text-center">
                  <p className="text-[11px] font-bold text-white uppercase tracking-tight">Upload de Foto</p>
                  <p className="text-[9px] text-[#8A96A3] uppercase tracking-widest mt-1">PNG, JPG até 5MB</p>
                </div>
              </>
            )}
          </button>
        )}

        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>

      {error && (
        <p className="text-[9px] text-red-400 font-medium uppercase tracking-widest mt-1">{error}</p>
      )}

      {(isCompatibilityMode || (currentImageUrl && currentImageUrl.startsWith('data:'))) && (
        <p className="text-[9px] text-emerald-400 font-medium uppercase tracking-widest mt-1 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-emerald-400 animate-pulse" /> Otimizado para web (modo de compatibilidade)
        </p>
      )}
    </div>
  );
}
