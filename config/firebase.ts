/**
 * Firebase config for current environment.
 * Uses dev project when __DEV__ is true, prod otherwise.
 * No .env needed; configs are in config/firebase.dev.json and config/firebase.prod.json.
 */

import devConfig from "./firebase.dev.json";
import prodConfig from "./firebase.prod.json";

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const dev = devConfig as FirebaseConfig;
const prod = prodConfig as FirebaseConfig;

export function getFirebaseConfig(): FirebaseConfig {
  return __DEV__ ? dev : prod;
}

export const firebaseConfig = getFirebaseConfig();
