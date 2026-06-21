import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  writeBatch
} from "firebase/firestore";

// Config parsed directly from the applet environment setup
const firebaseConfig = {
  projectId: "gen-lang-client-0699053288",
  appId: "1:776287510967:web:e2643d5aa8d536ba5d0832",
  apiKey: "AIzaSyDiIai1sIDytAmk_gkFrtCFw4Cq-UxjiPU",
  authDomain: "gen-lang-client-0699053288.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-3ffc4164-e99b-4272-8cb6-23ffc6b63f1d",
  storageBucket: "gen-lang-client-0699053288.firebasestorage.app",
  messagingSenderId: "776287510967"
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific provisioned database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Generic service helpers to fetch and write from firestore to make it super elegant in React
export const firestoreService = {
  getAll: async <T>(collectionName: string): Promise<T[]> => {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }) as T);
    } catch (error) {
      console.error(`Error fetching collection ${collectionName}:`, error);
      throw error;
    }
  },

  set: async (collectionName: string, id: string, data: any): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await setDoc(docRef, data, { merge: true });
    } catch (error) {
      console.error(`Error setting document in ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  add: async (collectionName: string, data: any): Promise<string> => {
    try {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, data);
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  },

  update: async (collectionName: string, id: string, data: any): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, data);
    } catch (error) {
      console.error(`Error updating document ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  delete: async (collectionName: string, id: string): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error(`Error deleting document ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  // Seed the database with our default values if it is empty
  seedCollection: async (collectionName: string, items: any[]): Promise<void> => {
    try {
      const colRef = collection(db, collectionName);
      const snapshot = await getDocs(colRef);
      if (snapshot.empty && items.length > 0) {
        console.log(`Seeding Firestore collection: ${collectionName}`);
        const batch = writeBatch(db);
        items.forEach(item => {
          // If the item has an id, use it as the document reference id
          const id = item.id || Math.random().toString(36).substring(2, 11);
          const docRef = doc(db, collectionName, id);
          batch.set(docRef, item);
        });
        await batch.commit();
      }
    } catch (error) {
      console.error(`Error seeding ${collectionName}:`, error);
    }
  }
};
