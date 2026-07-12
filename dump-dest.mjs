import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId || "(default)");

async function run() {
  const snapshot = await getDocs(collection(db, 'destinations'));
  const docs = snapshot.docs.map(d => d.data());
  fs.writeFileSync('dest-dump.json', JSON.stringify(docs, null, 2));
  console.log("Dumped " + docs.length + " destinations");
  process.exit(0);
}
run().catch(console.error);
