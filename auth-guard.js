
import { initializeApp, getApps } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
    authDomain: "arshu-9919.firebaseapp.com",
    projectId: "arshu-9919",
    storageBucket: "arshu-9919.firebasestorage.app",
    messagingSenderId: "629782428750",
    appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",
    measurementId: "G-29KEM972QS"
};

const app = getApps().length
    ? getApps()[0]
    : initializeApp(firebaseConfig);

const auth = getAuth(app);

// 24 hours
const LOGIN_LIMIT = 24 * 60 * 60 * 1000;

let expiryTimer = null;
let loggingOut = false;

// Logout function
async function forceLogout() {

    if (loggingOut) return;

    loggingOut = true;

    clearTimeout(expiryTimer);

    localStorage.removeItem("loginTime");

    try {
        await signOut(auth);
    } catch (error) {
        console.error("Logout error:", error);
    }

    window.location.replace("index.html");
}

// Check login expiry
function checkExpiry(user) {

    if (!user) {
        window.location.replace("index.html");
        return;
    }

    const loginTime = Number(
        localStorage.getItem("loginTime")
    );

    // Missing or invalid login time
    if (!loginTime || !Number.isFinite(loginTime)) {
        forceLogout();
        return;
    }

    const elapsed = Date.now() - loginTime;

    // Already 24 hours completed
    if (elapsed >= LOGIN_LIMIT) {
        forceLogout();
        return;
    }

    // Start remaining timer
    clearTimeout(expiryTimer);

    const remainingTime = LOGIN_LIMIT - elapsed;

    expiryTimer = setTimeout(() => {
        forceLogout();
    }, remainingTime);
}

// Firebase login check
onAuthStateChanged(auth, (user) => {
    checkExpiry(user);
});

// Check again when user returns to page
window.addEventListener("focus", () => {
    if (auth.currentUser) {
        checkExpiry(auth.currentUser);
    }
});

document.addEventListener("visibilitychange", () => {
    if (!document.hidden && auth.currentUser) {
        checkExpiry(auth.currentUser);
    }
});

window.addEventListener("pageshow", () => {
    if (auth.currentUser) {
        checkExpiry(auth.currentUser);
    }
});

// Logout other tabs/pages when session expires
window.addEventListener("storage", (event) => {

    if (
        event.key === "loginTime" &&
        event.newValue === null &&
        auth.currentUser
    ) {
        forceLogout();
    }

});
