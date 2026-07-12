import fs from 'fs';
const data = JSON.parse(fs.readFileSync('experiences-dump.json', 'utf-8'));
console.log(data[0].name);
