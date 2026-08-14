import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
    authDomain: "arshu-9919.firebaseapp.com",
    projectId: "arshu-9919",
    storageBucket: "arshu-9919.firebasestorage.app",
    messagingSenderId: "629782428750",
    appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",
    measurementId: "G-29KEM972QS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const SESSION_TIME = 24 * 60 * 60 * 1000;

onAuthStateChanged(auth, async function(user) {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    let loginTime = localStorage.getItem("loginTime");

    if (!loginTime) {
        localStorage.setItem("loginTime", Date.now().toString());
        loginTime = Date.now().toString();
    }

    if (Date.now() - Number(loginTime) >= SESSION_TIME) {

        localStorage.removeItem("loginTime");

        await signOut(auth);

        window.location.replace("index.html");
    }
});
