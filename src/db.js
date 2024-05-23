import firebase from "firebase/compat/app";
import "firebase/compat/database";

const firebaseConfig = {
  apiKey: "AIzaSyBTsgqiVtbTK9MGtIxuhNYuK2J9vyIVI2s",
  authDomain: "firevuechat-9c5a9.firebaseapp.com",
  databaseURL: "https://firevuechat-9c5a9-default-rtdb.firebaseio.com",
  projectId: "firevuechat-9c5a9",
  storageBucket: "firevuechat-9c5a9.appspot.com",
  messagingSenderId: "231233651968",
  appId: "1:231233651968:web:0ceaea2124219ee2175fe5",
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const db = firebase.database();

export default db;
