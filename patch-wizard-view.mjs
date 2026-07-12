import fs from 'fs';
let content = fs.readFileSync('src/components/WizardView.tsx', 'utf-8');

content = content.replace(/selectedExpDetail\.photos && selectedExpDetail\.photos\.length > 0 \?\s*\(\s*<img src=\{selectedExpDetail\.photos\[0\]\} alt=\{selectedExpDetail\.name\} className="w-full h-full object-cover filter brightness-\[0\.7\]" \/>\s*\)\s*:\s*\(\s*<div className="w-full h-full bg-\[#0D1B2A\] text-white flex items-center justify-center">Fundo<\/div>\s*\)/g, '<img src={getExperiencePhotos(selectedExpDetail)[0]} alt={selectedExpDetail.name} className="w-full h-full object-cover filter brightness-[0.7]" />');

fs.writeFileSync('src/components/WizardView.tsx', content);
