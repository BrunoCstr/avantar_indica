import { initializeApp } from "@react-native-firebase/app";
import { FIREBASE_PROJECTID, FIREBASE_APPID, FIREBASE_MESSAGINGSENDERID, FIREBASE_STORAGEBUCKET } from '@env';

const firebaseConfig = {
  apiKey: "",
  projectId: FIREBASE_PROJECTID,
  storageBucket: FIREBASE_STORAGEBUCKET,
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
export default app;
