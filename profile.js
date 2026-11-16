
import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
    authDomain: "arshu-9919.firebaseapp.com",
    projectId: "arshu-9919",
    messagingSenderId: "629782428750",
    appId: "1:629782428750:web:4db3c0d9d68f89c75f971f"
};

// Reuse existing Firebase app
const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

const dp = document.getElementById("dp");
const uid = document.getElementById("uid");
const username = document.getElementById("username");
const displayName = document.getElementById("displayName");
const photo = document.getElementById("photo");
const save = document.getElementById("save");
const statusText = document.getElementById("status");

const addDP = document.getElementById("addDP");
const changeDP = document.getElementById("changeDP");
const removeDP = document.getElementById("removeDP");

const DEFAULT_DP =
    "https://placehold.co/100x100/222/fff?text=DP";

let currentUser = null;
let oldPhoto = "";

function compressPhoto(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = () => {
            const img = new Image();

            img.onload = () => {
                const canvas = document.createElement("canvas");
                const max = 300;

                let width = img.width;
                let height = img.height;

                if (width > height && width > max) {
                    height = height * max / width;
                    width = max;
                } else if (height >= width && height > max) {
                    width = width * max / height;
                    height = max;
                }

                canvas.width = Math.round(width);
                canvas.height = Math.round(height);

                canvas.getContext("2d").drawImage(
                    img, 0, 0, canvas.width, canvas.height
                );

                resolve(canvas.toDataURL("image/jpeg", 0.6));
            };

            img.onerror = reject;
            img.src = reader.result;
        };

        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Load profile
onAuthStateChanged(auth, async user => {
    if (!user) {
        location.href = "index.html";
        return;
    }

    currentUser = user;
    uid.textContent = "UID: " + user.uid;

    statusText.textContent = "Loading profile...";

    try {
        const snap = await getDoc(doc(db, "profiles", user.uid));

        if (snap.exists()) {
            const p = snap.data();

            username.value = p.username || "";
            displayName.value = p.displayName || "";

            // Support previously used photo fields
            oldPhoto =
                p.photoBase64 ||
                p.photoURL ||
                p.photoUrl ||
                "";

            dp.src = oldPhoto || DEFAULT_DP;
        } else {
            statusText.textContent = "Profile document not found.";
            return;
        }

        statusText.textContent = "";
    } catch (error) {
        console.error("Profile load error:", error);
        statusText.textContent = "Profile load error: " + error.message;
    }
});

// Add / Change DP
addDP.onclick = () => photo.click();
changeDP.onclick = () => photo.click();

photo.onchange = async () => {
    const file = photo.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
        statusText.textContent = "Please select an image.";
        return;
    }

    try {
        const compressed = await compressPhoto(file);
        dp.src = compressed;
        statusText.textContent = "Photo selected. Press Save Profile.";
    } catch (error) {
        statusText.textContent = "Photo could not be loaded.";
    }
};

// Save profile
save.onclick = async () => {
    if (!currentUser) return;

    save.disabled = true;
    statusText.textContent = "Saving...";

    try {
        const usernameValue = username.value.trim().toLowerCase();
        const displayValue = displayName.value.trim();

        if (!/^[a-z0-9_]{3,20}$/.test(usernameValue)) {
            throw new Error("Username must be 3-20 characters (a-z, 0-9, _).");
        }

        let photoBase64 = oldPhoto;

        const file = photo.files?.[0];
        if (file) {
            photoBase64 = await compressPhoto(file);
        }

        if (photoBase64.length > 200000) {
            throw new Error("Photo too large. Select another photo.");
        }

        await setDoc(doc(db, "profiles", currentUser.uid), {
            uid: currentUser.uid,
            username: usernameValue,
            displayName: displayValue,
            photoBase64: photoBase64,
            updatedAt: serverTimestamp()
        }, { merge: true });

        oldPhoto = photoBase64;
        photo.value = "";

        statusText.textContent = "Profile saved successfully!";
    } catch (error) {
        console.error("Profile save error:", error);
        statusText.textContent = error.message;
    }

    save.disabled = false;
};

// Remove DP only
removeDP.onclick = async () => {
    if (!currentUser) return;
    if (!confirm("Are you sure you want to remove your DP?")) return;

    try {
        await setDoc(doc(db, "profiles", currentUser.uid), {
            photoBase64: "",
            updatedAt: serverTimestamp()
        }, { merge: true });

        oldPhoto = "";
        dp.src = DEFAULT_DP;
        photo.value = "";

        statusText.textContent = "DP removed successfully!";
    } catch (error) {
        statusText.textContent = error.message;
    }
};
