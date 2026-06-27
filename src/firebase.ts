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
  writeBatch,
  onSnapshot,
  query
} from "firebase/firestore";

// Config parsed directly from the applet environment setup with optional dynamic overrides for Vercel production
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "gen-lang-client-0699053288",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:776287510967:web:e2643d5aa8d536ba5d0832",
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDiIai1sIDytAmk_gkFrtCFw4Cq-UxjiPU",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "gen-lang-client-0699053288.firebaseapp.com",
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || "ai-studio-3ffc4164-e99b-4272-8cb6-23ffc6b63f1d",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "gen-lang-client-0699053288.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "776287510967"
};

// Initialize App
const app = initializeApp(firebaseConfig);

// Initialize Firestore targeting the specific provisioned database
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

// Helper to remove undefined values before sending to Firestore
const sanitizeData = (data: any): any => {
  if (data === undefined) return null;
  if (data === null || typeof data !== "object") return data;
  
  if (Array.isArray(data)) {
    return data.map(sanitizeData);
  }

  const sanitized: any = {};
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key];
      sanitized[key] = value === undefined ? null : sanitizeData(value);
    }
  }
  return sanitized;
};

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
      await setDoc(docRef, sanitizeData(data), { merge: true });
    } catch (error) {
      console.error(`Error setting document in ${collectionName}/${id}:`, error);
      throw error;
    }
  },

  add: async (collectionName: string, data: any): Promise<string> => {
    try {
      const colRef = collection(db, collectionName);
      const docRef = await addDoc(colRef, sanitizeData(data));
      return docRef.id;
    } catch (error) {
      console.error(`Error adding document to ${collectionName}:`, error);
      throw error;
    }
  },

  update: async (collectionName: string, id: string, data: any): Promise<void> => {
    try {
      const docRef = doc(db, collectionName, id);
      await updateDoc(docRef, sanitizeData(data));
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

  subscribe: (collectionName: string, callback: (data: any[]) => void): () => void => {
    const colRef = collection(db, collectionName);
    const q = query(colRef);
    return onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(data);
    }, (error) => {
      console.error(`Error subscribing to ${collectionName}:`, error);
    });
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
          batch.set(docRef, sanitizeData(item));
        });
        await batch.commit();
      }
    } catch (error) {
      console.error(`Error seeding ${collectionName}:`, error);
    }
  }
};
