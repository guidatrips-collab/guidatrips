import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function run() {
  const docRef = doc(db, 'accommodations', '1783575802252');
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    console.log(JSON.stringify(docSnap.data(), null, 2));
  } else {
    console.log("No such document!");
  }
  process.exit(0);
}
run().catch(console.error);
