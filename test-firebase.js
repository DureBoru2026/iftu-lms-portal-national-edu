import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { readFileSync } from 'fs';

const firebaseConfig = JSON.parse(readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);

async function testFirebase() {
  const docRef = doc(db, 'users', 'test_user_id');
  try {
    await setDoc(docRef, {
      id: "test_user_id",
      name: "Test User",
      email: "test@example.com",
      role: "student",
      sovereignIndex: 1,
      studentIdNumber: "SID-12345678"
    });
    console.log("Successfully created user doc!");
  } catch (err) {
    console.error("Failed to create user doc:", err.code, err.message);
  }
}

testFirebase();
