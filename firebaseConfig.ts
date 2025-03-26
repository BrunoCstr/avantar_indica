import { initializeApp } from "@react-native-firebase/app";
import { FIREBASE_PROJECTID, FIREBASE_APPID, FIREBASE_MESSAGINGSENDERID } from '@env';

const firebaseConfig = {
  apiKey: "",
  projectId: FIREBASE_PROJECTID,
//storageBucket: "seu-projeto.appspot.com",
  messagingSenderId: FIREBASE_MESSAGINGSENDERID,
  appId: FIREBASE_APPID,
};

const app = initializeApp(firebaseConfig);
export default app;
