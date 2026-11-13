// document.getElementById("logout").addEventListener("click", function () {

//     let check = confirm("Kya aap logout karna chahte hain?");

//     if (check) {
//         window.location.href = "index.html";
//     }

// });


// import { initializeApp, getApps, getApp } from
// "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// import {
//     getAuth,
//     signOut
// } from
// "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// const firebaseConfig = {

//     apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",

//     authDomain: "arshu-9919.firebaseapp.com",

//     projectId: "arshu-9919",

//     storageBucket: "arshu-9919.firebasestorage.app",

//     messagingSenderId: "629782428750",

//     appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",

//     measurementId: "G-29KEM972QS"
// };


// // Firebase app already hai to wahi use karega
// const app = getApps().length
//     ? getApp()
//     : initializeApp(firebaseConfig);

// const auth = getAuth(app);


// // ==============================
// // LOGOUT
// // ==============================

// document.getElementById("logout").addEventListener(
//     "click",
//     async function () {

//         let check = confirm(
//             "MEOW?"
//         );

//         if (!check) {
//             return;
//         }


//         try {

//             // Firebase se completely logout
//             await signOut(auth);

//             // 24 hour login timer delete
//             localStorage.removeItem("loginTime");

//             // Login page
//             window.location.replace("index.html");

//         }

//         catch (error) {

//             console.error(error);

//             alert(
//                 "Logout nahi hua. Dobara try karo."
//             );

//         }

//     }
// );



// // document.getElementById("logout").addEventListener("click", function () {

// //     let check = confirm("Kya aap logout karna chahte hain?");

// //     if (check) {
// //         window.location.href = "index.html";
// //     }

// // });


// import { initializeApp, getApps, getApp } from
// "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// import {
//     getAuth,
//     signOut
// } from
// "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// const firebaseConfig = {

//     apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",

//     authDomain: "arshu-9919.firebaseapp.com",

//     projectId: "arshu-9919",

//     storageBucket: "arshu-9919.firebasestorage.app",

//     messagingSenderId: "629782428750",

//     appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",

//     measurementId: "G-29KEM972QS"
// };


// // Firebase app already hai to wahi use karega
// const app = getApps().length
//     ? getApp()
//     : initializeApp(firebaseConfig);

// const auth = getAuth(app);


// // ==============================
// // LOGOUT
// // ==============================

// document.getElementById("logout").addEventListener(
//     "click",
//     async function () {

//         let check = confirm(
//             "Kya aap logout karna chahte ho?"
//         );

//         if (!check) {
//             return;
//         }


//         try {

//             // Firebase se completely logout
//             await signOut(auth);

//             // 24 hour login timer delete
//             localStorage.removeItem("loginTime");

//             // Login page
//             window.location.replace("index.html");

//         }

//         catch (error) {
 
//             console.error(error);

//             alert(
//                 "Logout nahi hua. Dobara try karo."
//             );

//         }

//     }
// );


// import {
//     getFirestore,
//     doc,
//     getDoc
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

// import {
//     getAuth,
//     onAuthStateChanged
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// const db = getFirestore();
// const auth = getAuth();

// onAuthStateChanged(auth, async (user) => {
//     if (!user) return;

//     const snap = await getDoc(doc(db, "profiles", user.uid));

//     if (snap.exists()) {
//         const data = snap.data();

//         document.getElementById("notesDP").src =
//             data.photoBase64 ||
//             "https://placehold.co/80x80/222/fff?text=DP";
//     }
// });




import { initializeApp, getApps, getApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    signOut,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    doc,
    getDoc
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
    authDomain: "arshu-9919.firebaseapp.com",
    projectId: "arshu-9919",
    storageBucket: "arshu-9919.firebasestorage.app",
    messagingSenderId: "629782428750",
    appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",
    measurementId: "G-29KEM972QS"
};

// Firebase initialize
const app = getApps().length
    ? getApp()
    : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// ==============================
// NOTES DP LOAD
// ==============================

const notesDP = document.getElementById("notesDP");

onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    try {
        const snap = await getDoc(
            doc(db, "profiles", user.uid)
        );

        if (snap.exists()) {
            const data = snap.data();

            if (notesDP) {
                notesDP.src = data.photoBase64 ||
                    "https://placehold.co/80x80/222/fff?text=DP";
            }
        }
    } catch (error) {
        console.error("Notes DP error:", error);
    }
});

// ==============================
// LOGOUT
// ==============================

document.getElementById("logout").addEventListener(
    "click",
    async function () {

        const check = confirm(
            "Kya aap logout karna chahte ho?"
        );

        if (!check) return;

        try {
            await signOut(auth);

            localStorage.removeItem("loginTime");

            window.location.replace("index.html");

        } catch (error) {
            console.error(error);
            alert("Logout nahi hua. Dobara try karo.");
        }
    }
);

