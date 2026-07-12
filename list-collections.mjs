import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || "(default)");

// In Firestore Web SDK, there's no native listCollections.
// But we know standard collections.
const collections = ['experiences', 'posts', 'leads', 'destinations', 'accommodations', 'settings'];

async function run() {
  for (const c of collections) {
    const snap = await getDocs(collection(db, c));
    console.log(`Collection ${c} has ${snap.size} documents.`);
  }
  process.exit(0);
}
run().catch(console.error);
