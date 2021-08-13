import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/analytics";

var app = firebase.initializeApp({
  apiKey: process.env.REACT_APP_FIREBASE__API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE__AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE__PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE__STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE__MESSENGERSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
});

const db = firebase.firestore();
db.settings({ timestampsInSnapshots: true });
firebase.analytics();

export { db };

export const auth = app.auth();
export default app;
