/**
 * Firebase JS SDK initialization for Expo (managed workflow).
 * Uses config from config/firebase.ts (dev vs prod via __DEV__).
 * @see https://docs.expo.dev/guides/using-firebase/#using-firebase-js-sdk
 */

import { initializeApp } from "firebase/app";
import { firebaseConfig } from "@/config/firebase";

const app = initializeApp(firebaseConfig);

export { app };
export default app;
