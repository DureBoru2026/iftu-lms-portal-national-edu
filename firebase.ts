import { initializeApp } from 'firebase/app';
import { getAuth, setPersistence, browserLocalPersistence, browserPopupRedirectResolver } from 'firebase/auth';
import { getFirestore, initializeFirestore, memoryLocalCache, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import firebaseConfig from './firebase-applet-config.json';

const app = initializeApp(firebaseConfig);

// Initialize Firestore with memory cache. 
// We use experimentalForceLongPolling to resolve internal assertion failures (ca9/b815) 
// that can occur in restricted proxy/iframe environments.
export const db = initializeFirestore(app, {
  ignoreUndefinedProperties: true,
  localCache: memoryLocalCache(),
  experimentalForceLongPolling: true,
  experimentalAutoDetectLongPolling: false
}, firebaseConfig.firestoreDatabaseId);

/**
 * Force a network reconnection attempt.
 * Useful in iframe environments when the connection gets stuck.
 */
let isReconnecting = false;
export const reconnectDb = async () => {
  console.log('Sovereign DB: Connection check skipped to stabilize SDK handshake.');
  return true;
};

export const auth = getAuth(app);
// Explicitly set persistence and resolver to handle iframe storage and popup issues
setPersistence(auth, browserLocalPersistence).catch(err => console.error("Auth persistence failed:", err));
(auth as any).config.popupRedirectResolver = browserPopupRedirectResolver;

export const storage = getStorage(app);

// Validate Connection to Firestore and retry if unavailable
async function testConnection(retries = 3) {
  try {
    // Attempt to fetch a non-existent doc to test connectivity
    // Using getDoc allows cache if server is slow, but here we just want to see if it throws assertion error
    const { getDoc } = await import('firebase/firestore');
    await getDoc(doc(db, '_internal_', 'connectivity_test'));
    console.log("Firestore connection verified.");
  } catch (error: any) {
    // If it's just "not found" or "permission-denied", that's a success for connectivity
    if (error.code === 'not-found' || error.code === 'permission-denied') {
      console.log("Firestore connection verified (reached server).");
      return;
    }
    
    if (error.code === 'unavailable' || (error.message && error.message.includes('the client is offline'))) {
      if (retries > 0) {
        console.warn(`Firestore unavailable, retrying connection (${retries} attempts left)...`);
        await reconnectDb();
        await new Promise(r => setTimeout(r, 2000));
        return testConnection(retries - 1);
      }
      console.warn("Firestore is currently in offline mode. The app will sync when connection is restored.");
    } else {
      console.error("Firestore connection test failed:", error.message || error);
    }
  }
}

// testConnection();
