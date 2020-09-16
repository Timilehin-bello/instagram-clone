import firebase from 'firebase';


const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAGzh42x9rK1fho7guCk5OXJUgxnTgnehs",
    authDomain: "instagram-clone-cn.firebaseapp.com",
    databaseURL: "https://instagram-clone-cn.firebaseio.com",
    projectId: "instagram-clone-cn",
    storageBucket: "instagram-clone-cn.appspot.com",
    messagingSenderId: "775996014701",
    appId: "1:775996014701:web:1ec4e8bf63d013bf30ff64",
    measurementId: "G-DQMTWNFC6L"
});


const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();


export {db, auth, storage }