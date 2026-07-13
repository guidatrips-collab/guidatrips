import fs from 'fs';

let content = fs.readFileSync('src/components/ImageUpload.tsx', 'utf-8');

// Add imports
const importsToAdd = `
import CropModal from './CropModal';
import { getCroppedImg } from '../utils/cropImage';
import { Crop } from 'lucide-react';
`;
content = content.replace("import { storageService } from '../firebase';", "import { storageService } from '../firebase';\n" + importsToAdd);

// Add state for CropModal
const stateToAdd = `
  const [showCropModal, setShowCropModal] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
`;
content = content.replace("const fileInputRef = useRef<HTMLInputElement>(null);", "const fileInputRef = useRef<HTMLInputElement>(null);\n" + stateToAdd);

// Modify handleFileChange to set imageToCrop and open modal instead of uploading directly
const newHandleFileChange = `
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Por favor, selecione um arquivo de imagem.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) { 
      setError("A imagem deve ter menos de 10MB.");
      return;
    }

    try {
      // Create local URL for the selected file and open cropper
      const objectUrl = URL.createObjectURL(file);
      setImageToCrop(objectUrl);
      setShowCropModal(true);
    } catch (err) {
      setError("Falha ao ler a imagem.");
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCropComplete = async (croppedAreaPixels: any) => {
    if (!imageToCrop) return;
    
    try {
      setIsUploading(true);
      setError(null);
      setShowCropModal(false);
      setIsCompatibilityMode(false);
      
      const croppedFile = await getCroppedImg(imageToCrop, croppedAreaPixels, 800, 800);
      
      if (!croppedFile) {
        throw new Error("Failed to crop image");
      }

      // Cleanup object URL
      if (imageToCrop.startsWith('blob:')) {
        URL.revokeObjectURL(imageToCrop);
      }
      setImageToCrop(null);
      
      try {
        const uploadPromise = storageService.uploadFile(croppedFile, folder);
        const url = await promiseWithTimeout(
          uploadPromise,
          5000, // increased timeout due to file upload
          new Error("Upload timeout due to potential CORS or network issue")
        );
        onUploadComplete(url);
      } catch (storageErr) {
        console.warn("Firebase Storage upload failed or timed out (CORS/Permissions). Falling back to ultra-optimized Base64:", storageErr);
        
        const compressedUrl = await compressAndConvertToBase64(croppedFile);
        setIsCompatibilityMode(true);
        onUploadComplete(compressedUrl);
      }
    } catch (err) {
      console.error("Crop/Upload failed:", err);
      setError("Falha ao processar a imagem recortada. Tente novamente.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditCrop = () => {
    if (currentImageUrl) {
      setImageToCrop(currentImageUrl);
      setShowCropModal(true);
    }
  };
`;
content = content.replace(/const handleFileChange = async[\s\S]*?const handleRemove = async/, newHandleFileChange + '\n  const handleRemove = async');

// Add crop modal render at the end of the component
const cropModalJSX = `
      {showCropModal && imageToCrop && (
        <CropModal
          imageUrl={imageToCrop}
          onClose={() => {
            setShowCropModal(false);
            if (imageToCrop.startsWith('blob:')) {
              URL.revokeObjectURL(imageToCrop);
            }
            setImageToCrop(null);
          }}
          onCropComplete={handleCropComplete}
        />
      )}
`;
content = content.replace("    </div>\n  );\n}", cropModalJSX + "    </div>\n  );\n}");

// Add crop button next to upload and remove
const cropBtn = `
              <button
                type="button"
                onClick={handleEditCrop}
                className="p-2 bg-blue-500/20 hover:bg-blue-500/40 rounded-full text-blue-400 transition-colors"
                title="Editar Enquadramento"
              >
                <Crop className="w-4 h-4" />
              </button>
`;
content = content.replace(/<button\s+type="button"\s+onClick=\{handleRemove\}/, cropBtn + "              <button\n                type=\"button\"\n                onClick={handleRemove}");

fs.writeFileSync('src/components/ImageUpload.tsx', content);
