import React, { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { storageService } from '../firebase';

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
      
      const url = await storageService.uploadFile(file, folder);
      onUploadComplete(url);
    } catch (err) {
      console.error("Upload failed:", err);
      setError("Falha ao subir imagem. Verifique se o Firebase Storage está ativo.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemove = async () => {
    if (!currentImageUrl) return;
    
    // Optional: Delete from storage when removed from UI
    // For now, we just trigger the callback
    if (onRemove) {
      onRemove();
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
    </div>
  );
}
