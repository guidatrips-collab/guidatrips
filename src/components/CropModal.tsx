import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { X, Check, ZoomIn, ZoomOut } from 'lucide-react';

interface CropModalProps {
  imageUrl: string;
  onClose: () => void;
  onCropComplete: (croppedAreaPixels: any) => void;
}

export default function CropModal({ imageUrl, onClose, onCropComplete }: CropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropCompleteCallback = useCallback((croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleConfirm = () => {
    if (croppedAreaPixels) {
      onCropComplete(croppedAreaPixels);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
      <div className="bg-[#0D1B2A] rounded-xl border border-white/10 w-full max-w-2xl overflow-hidden flex flex-col">
        <div className="p-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="text-white font-accent font-bold uppercase tracking-widest text-sm">Ajustar Enquadramento</h3>
          <button onClick={onClose} className="text-white/60 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="relative w-full h-[50vh] sm:h-[60vh] bg-black">
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            aspect={1}
            onCropChange={setCrop}
            onCropComplete={onCropCompleteCallback}
            onZoomChange={setZoom}
            cropShape="rect"
            showGrid={true}
          />
        </div>
        
        <div className="p-6 bg-[#132033] flex flex-col gap-6">
          <div className="flex items-center gap-4">
            <ZoomOut className="w-4 h-4 text-white/50" />
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-[#E8711A]"
            />
            <ZoomIn className="w-4 h-4 text-white/50" />
          </div>
          
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 rounded-lg font-accent text-xs font-bold uppercase text-white/80 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              className="px-6 py-2 rounded-lg font-accent text-xs font-bold uppercase bg-[#E8711A] text-[#0D1B2A] hover:bg-[#FF8A3F] transition-colors flex items-center gap-2"
            >
              <Check className="w-4 h-4" /> Confirmar Recorte
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
