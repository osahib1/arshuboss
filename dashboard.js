// // document.getElementById("logout").addEventListener("click", function () {

// //     let check = confirm("jaldi yes karo");

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




// import { doc, getDoc } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";
// import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// onAuthStateChanged(auth, async (user) => {
//   if (!user) return;

//   try {
//     const snap = await getDoc(doc(db, "profiles", user.uid));

//     if (snap.exists()) {
//       const data = snap.data();

//       if (data.photoBase64) {
//         document.getElementById("dashboardDP").src =
//           data.photoBase64;
//       }
//     }
//   } catch (error) {
//     console.error("DP load error:", error);
//   }
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
// PROFILE DP LOAD
// ==============================

const dashboardDP = document.getElementById("dashboardDP");

onAuthStateChanged(auth, async (user) => {

    if (!user) return;

    try {
        const profileRef = doc(db, "profiles", user.uid);
        const snap = await getDoc(profileRef);

        if (snap.exists()) {
            const data = snap.data();

            dashboardDP.src = data.photoBase64 ||
    "https://placehold.co/80x80/222/fff?text=DP";
        }

    } catch (error) {
        console.error("DP load error:", error);
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
