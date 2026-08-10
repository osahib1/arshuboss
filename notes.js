
import { initializeApp, getApps, getApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
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


// Firebase app already hai to wahi use karega
const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);


// ==============================
// LOGOUT
// ==============================

document.getElementById("logout").addEventListener(
    "click",
    async function () {

        let check = confirm(
            "Kya aap logout karna chahte ho?"
        );

        if (!check) {
            return;
        }


        try {

            // Firebase se completely logout
            await signOut(auth);

            // 24 hour login timer delete
            localStorage.removeItem("loginTime");

            // Login page
            window.location.replace("index.html");

        }

        catch (error) {

            console.error(error);

            alert(
                "Logout nahi hua. Dobara try karo."
            );

        }

    }
);
