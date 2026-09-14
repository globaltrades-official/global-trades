import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
} from 'firebase/firestore';

const CONFIG_STORAGE_KEY = 'gt_firebase_config_v1';
const CATALOG_COLLECTION = 'gt_catalog';
const CATALOG_DOC_ID = 'products_v1';

// Read config from localStorage or Vite environment variables
export function getStoredFirebaseConfig() {
  try {
    const fromStorage = localStorage.getItem(CONFIG_STORAGE_KEY);
    if (fromStorage) {
      const parsed = JSON.parse(fromStorage);
      if (parsed && parsed.projectId && parsed.apiKey) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('Could not read firebase config from storage:', e);
  }

  // Fallback to Vite environment variables if defined
  if (
    typeof import.meta !== 'undefined' &&
    import.meta.env &&
    import.meta.env.VITE_FIREBASE_API_KEY &&
    import.meta.env.VITE_FIREBASE_PROJECT_ID
  ) {
    return {
      apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
      authDomain:
        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
        `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
      projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
      storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
      messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
      appId: import.meta.env.VITE_FIREBASE_APP_ID,
    };
  }

  return null;
}

let firebaseApp = null;
let firestoreDb = null;

export function getFirestoreInstance() {
  if (firestoreDb) return firestoreDb;

  const config = getStoredFirebaseConfig();
  if (!config) return null;

  try {
    firebaseApp = getApps().length > 0 ? getApp() : initializeApp(config);
    firestoreDb = getFirestore(firebaseApp);
    return firestoreDb;
  } catch (e) {
    console.error('Failed to initialize Firebase app:', e);
    return null;
  }
}

export function isCloudConfigured() {
  return Boolean(getStoredFirebaseConfig());
}

export function saveFirebaseConfig(config) {
  try {
    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(config));
    firebaseApp = null;
    firestoreDb = null;
    window.dispatchEvent(new Event('firebase-config-updated'));
    return true;
  } catch (e) {
    console.error('Failed to save firebase config:', e);
    return false;
  }
}

export function removeFirebaseConfig() {
  try {
    localStorage.removeItem(CONFIG_STORAGE_KEY);
    firebaseApp = null;
    firestoreDb = null;
    window.dispatchEvent(new Event('firebase-config-updated'));
    return true;
  } catch (e) {
    return false;
  }
}

// Subscribe to real-time changes of the catalog in Firestore
export function subscribeToCloudCatalog(onSuccess, onError) {
  const db = getFirestoreInstance();
  if (!db) {
    return () => {};
  }

  try {
    const catalogRef = doc(db, CATALOG_COLLECTION, CATALOG_DOC_ID);
    const unsubscribe = onSnapshot(
      catalogRef,
      (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (Array.isArray(data.products) && data.products.length > 0) {
            onSuccess(data.products, data.updatedAt);
          }
        }
      },
      (error) => {
        console.warn('Firestore subscription notice:', error);
        if (onError) onError(error);
      }
    );
    return unsubscribe;
  } catch (e) {
    console.warn('Failed to subscribe to cloud catalog:', e);
    return () => {};
  }
}

// Push catalog updates to Firestore
export async function saveCatalogToCloud(products) {
  const db = getFirestoreInstance();
  if (!db) return false;

  try {
    const catalogRef = doc(db, CATALOG_COLLECTION, CATALOG_DOC_ID);
    await setDoc(
      catalogRef,
      {
        products,
        updatedAt: new Date().toISOString(),
        itemCount: products.length,
        featuredCount: products.filter((p) => p.isFeatured).length,
      },
      { merge: true }
    );
    return true;
  } catch (e) {
    console.error('Failed to save catalog to Firestore:', e);
    return false;
  }
}
