import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
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

onAuthStateChanged(auth, function(user) {

    if (!user) {
        window.location.replace("index.html");
    }

});