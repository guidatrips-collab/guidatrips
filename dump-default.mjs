import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf-8'));
const app = initializeApp(config);
// Query the default database!
const db = getFirestore(app);

async function run() {
  const snapshot = await getDocs(collection(db, 'experiences'));
  const docs = snapshot.docs.map(d => d.data());
  fs.writeFileSync('experiences-default-dump.json', JSON.stringify(docs, null, 2));
  console.log("Dumped " + docs.length + " experiences from default DB");
  process.exit(0);
}
run().catch(console.error);
