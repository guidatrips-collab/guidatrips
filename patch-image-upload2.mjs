import fs from 'fs';

let content = fs.readFileSync('src/components/ImageUpload.tsx', 'utf-8');

// update props
content = content.replace(
  "onUploadComplete: (url: string) => void;",
  "onUploadComplete: (url: string, originalUrl?: string, cropData?: any) => void;"
);

// add original file state
content = content.replace(
  "const [imageToCrop, setImageToCrop] = useState<string | null>(null);",
  "const [imageToCrop, setImageToCrop] = useState<string | null>(null);\n  const [originalFile, setOriginalFile] = useState<File | null>(null);"
);

// handleFileChange
content = content.replace(
  "setImageToCrop(objectUrl);",
  "setImageToCrop(objectUrl);\n      setOriginalFile(file);"
);

// handleCropComplete
const oldHandleCropComplete = `      try {
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
      }`;

const newHandleCropComplete = `      try {
        // Upload cropped image
        const uploadPromise = storageService.uploadFile(croppedFile, folder);
        const url = await promiseWithTimeout(
          uploadPromise,
          5000,
          new Error("Upload timeout")
        );
        
        // Upload original image if it exists
        let originalUrl = undefined;
        if (originalFile) {
          try {
            const originalPromise = storageService.uploadFile(originalFile, folder + '/originals');
            originalUrl = await promiseWithTimeout(originalPromise, 10000, new Error("Original upload timeout"));
          } catch (origErr) {
            console.warn("Failed to upload original file, continuing without it.", origErr);
          }
        }
        
        onUploadComplete(url, originalUrl, croppedAreaPixels);
      } catch (storageErr) {
        console.warn("Firebase Storage upload failed or timed out (CORS/Permissions). Falling back to ultra-optimized Base64:", storageErr);
        
        const compressedUrl = await compressAndConvertToBase64(croppedFile);
        let originalCompressedUrl = undefined;
        if (originalFile) {
          originalCompressedUrl = await compressAndConvertToBase64(originalFile);
        }
        setIsCompatibilityMode(true);
        onUploadComplete(compressedUrl, originalCompressedUrl, croppedAreaPixels);
      }`;

content = content.replace(oldHandleCropComplete, newHandleCropComplete);

// Fix handleEditCrop (when clicking edit on already uploaded image)
content = content.replace(
  "setImageToCrop(currentImageUrl);",
  "setImageToCrop(currentImageUrl);\n      setOriginalFile(null);"
);

fs.writeFileSync('src/components/ImageUpload.tsx', content);
