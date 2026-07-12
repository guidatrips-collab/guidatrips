import fs from 'fs';
let content = fs.readFileSync('src/components/ExperiencesView.tsx', 'utf-8');

// Insert const _activePhotos = getExperiencePhotos(activeExperience); inside the modal if activeExperience is not null
// Actually it's easier to just replace inline:
content = content.replace(/activeExperience\.photos && activeExperience\.photos\.length > 0 \? activeExperience\.photos\[0\] : "https:\/\/images\.unsplash\.com\/photo-1507525428034-b723cf961d3e\?auto=format&fit=crop&w=1200&q=80"/g, 'getExperiencePhotos(activeExperience)[0]');
content = content.replace(/activeExperience\.photos && activeExperience\.photos\.length > 1/g, 'getExperiencePhotos(activeExperience).length > 1');
content = content.replace(/activeExperience\.photos\.slice\(1\)/g, 'getExperiencePhotos(activeExperience).slice(1)');

// Same for recExp
content = content.replace(/recExp\.photos && recExp\.photos\.length > 0 \? recExp\.photos\[0\] : "https:\/\/images\.unsplash\.com\/photo-1507525428034-b723cf961d3e\?auto=format&fit=crop&w=100&q=80"/g, 'getExperiencePhotos(recExp)[0]');

fs.writeFileSync('src/components/ExperiencesView.tsx', content);
