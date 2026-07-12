import fs from 'fs';

let content = fs.readFileSync('src/components/ExperienceMediaGallery.tsx', 'utf-8');

// Replace getFallbackPhotos function with nothing or just remove its usage
content = content.replace(/export function getFallbackPhotos[\s\S]*?^}/m, '');

// Replace getExperiencePhotos logic
const newGetExperiencePhotos = `export function getExperiencePhotos(experience: Experience): string[] {
  let list: string[] = [];
  if (experience.mediaGallery && experience.mediaGallery.length > 0) {
    list = experience.mediaGallery
      .filter(item => item.type === "image")
      .map(item => item.url);
  }
  
  if (list.length === 0 && experience.photos && experience.photos.length > 0) {
    list = experience.photos.filter(p => p && p.trim() !== "");
  }
      
  if (list.length === 0) {
    list = ["https://placehold.co/800x600/e2e8f0/64748b.png?text=Sem+Foto"];
  }
      
  return list;
}`;

content = content.replace(/export function getExperiencePhotos[\s\S]*?^}/m, newGetExperiencePhotos);

fs.writeFileSync('src/components/ExperienceMediaGallery.tsx', content);
