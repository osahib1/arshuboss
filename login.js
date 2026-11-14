
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

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

const loginBtn = document.getElementById("loginBtn");

loginBtn.addEventListener("click", async function () {

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Email aur Password bharo.");
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Please wait...";

    try {

        await signInWithEmailAndPassword(auth, email, password);

        localStorage.setItem("loginTime", Date.now().toString());
        localStorage.setItem("justLoggedIn", "yes");

        window.location.replace("dashboard.html");

    } catch (error) {

        console.error("Login Error:", error);

        alert("Login failed: " + error.message);

        loginBtn.disabled = false;
        loginBtn.textContent = "Sign In";
    }
});
