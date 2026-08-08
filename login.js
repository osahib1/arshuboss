// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// import {
//   getAuth,
//   signInWithEmailAndPassword
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "arshu-9919.firebaseapp.com",
//   projectId: "arshu-9919",
//   storageBucket: "arshu-9919.firebasestorage.app",
//   messagingSenderId: "629782428750",
//   appId: "YOUR_APP_ID"
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // const btn = document.getElementById("loginBtn");

// btn.addEventListener("click", () => {

//     const email = document.getElementById("email").value;

//     const password = document.getElementById("password").value;

//     signInWithEmailAndPassword(auth,email,password)

//     .then(() => {

//         window.location.href="dashboard.html";

//     })

//     .catch((error)=>{

//         alert(error.message);

//     });

// });
//    console.log("login.js loaded");

// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

// import {
//   getAuth,
//   signInWithEmailAndPassword
// } from "https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

// // Firebase Config
// const firebaseConfig = {
//   apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",
//   authDomain: "arshu-9919.firebaseapp.com",
//   projectId: "arshu-9919",
//   storageBucket: "arshu-9919.firebasestorage.app",
//   messagingSenderId: "629782428750",
//   appId: "1:629782428750:web:4db3c0d9d68f89c75f971f"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);

// // Login Button
// const btn = document.getElementById("loginBtn");

// btn.addEventListener("click", () => {

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     signInWithEmailAndPassword(auth, email, password)
//         .then((userCredential) => {

//             alert("Login Successful");

//             window.location.href = "dashboard.html";

//         })
//         .catch((error) => {

//             alert(error.message);

//         });

// });

// btn.addEventListener("click", () => {

//     console.log("Button Clicked");

//     const email = document.getElementById("email").value;
//     const password = document.getElementById("password").value;

//     console.log(email);
//     console.log(password);

// });



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


const loginBtn =
    document.getElementById("loginBtn");


loginBtn.addEventListener("click", function () {

    const email =
        document.getElementById("email").value.trim();

    const password =
        document.getElementById("password").value;


    if (email === "" || password === "") {

        alert("Email aur Password bharo.");

        return;

    }


    signInWithEmailAndPassword(
        auth,
        email,
        password
    )

    .then(function () {

        window.location.href = "dashboard.html";

    })

    .catch(function (error) {

        console.log(error);

        alert("Wrong Email or Password");

    });

});