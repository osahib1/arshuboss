// const website =
//     document.getElementById("website");

// const username =
//     document.getElementById("username");

// const password =
//     document.getElementById("password");

// const note =
//     document.getElementById("note");

// const saveBtn =
//     document.getElementById("saveBtn");

// const showPassword =
//     document.getElementById("showPassword");

// const passwordList =
//     document.getElementById("passwordList");


// // =========================
// // LOAD SAVED PASSWORDS
// // =========================

// let savedPasswords =
//     JSON.parse(
//         localStorage.getItem("savedPasswords")
//     ) || [];


// // =========================
// // SHOW / HIDE NEW PASSWORD
// // =========================

// showPassword.addEventListener(
//     "click",
//     function () {

//         if (password.type === "password") {

//             password.type = "text";

//             showPassword.textContent = "🙈";

//         }

//         else {

//             password.type = "password";

//             showPassword.textContent = "👁";

//         }

//     }
// );


// // =========================
// // SAVE PASSWORD
// // =========================

// saveBtn.addEventListener(
//     "click",
//     function () {

//         if (
//             website.value.trim() === "" ||
//             username.value.trim() === "" ||
//             password.value.trim() === ""
//         ) {

//             alert(
//                 "Website, Username aur Password bharo."
//             );

//             return;

//         }


//         const data = {

//             id: Date.now(),

//             website: website.value,

//             username: username.value,

//             password: password.value,

//             note: note.value

//         };


//         savedPasswords.push(data);


//         localStorage.setItem(
//             "savedPasswords",
//             JSON.stringify(savedPasswords)
//         );


//         // CLEAR INPUTS

//         website.value = "";

//         username.value = "";

//         password.value = "";

//         note.value = "";

//         showPassword.textContent = "👁";


//         showPasswords();


//         alert("Password Saved!");

//     }
// );


// // =========================
// // SHOW SAVED PASSWORDS
// // =========================

// function showPasswords() {

//     passwordList.innerHTML = "";


//     savedPasswords.forEach(
//         function (item) {

//             const div =
//                 document.createElement("div");


//             div.className = "saved-item";


//             div.innerHTML = `

//                 <h3>
//                     🌐 ${escapeHTML(item.website)}
//                 </h3>

//                 <p>
//                     👤 ${escapeHTML(item.username)}
//                 </p>


//                 <div class="saved-password">

//                     <span>🔑</span>

//                     <input
//                         type="password"
//                         value="${escapeHTML(item.password)}"
//                         readonly
//                         id="pass-${item.id}"
//                     >


//                     <button
//                         type="button"
//                         onclick="toggleSavedPassword(${item.id})"
//                         id="show-${item.id}"
//                     >
//                         👁 Show
//                     </button>

//                 </div>


//                 <p>
//                     📝 ${escapeHTML(
//                         item.note || "No note"
//                     )}
//                 </p>


//                 <button
//                     type="button"
//                     class="delete-btn"
//                     onclick="deletePassword(${item.id})"
//                 >
//                     🗑 Delete
//                 </button>

//             `;


//             passwordList.appendChild(div);

//         }
//     );

// }


// // =========================
// // SHOW / HIDE SAVED PASSWORD
// // =========================

// function toggleSavedPassword(id) {

//     const input =
//         document.getElementById(
//             "pass-" + id
//         );


//     const button =
//         document.getElementById(
//             "show-" + id
//         );


//     if (input.type === "password") {

//         input.type = "text";

//         button.textContent = "🙈 Hide";

//     }

//     else {

//         input.type = "password";

//         button.textContent = "👁 Show";

//     }

// }


// // =========================
// // DELETE PASSWORD
// // =========================

// function deletePassword(id) {


//     // CREATE POPUP

//     const box =
//         document.createElement("div");


//     box.className = "delete-popup";


//     box.innerHTML = `

//         <div class="delete-box">

//             <h3>
//                 Delete Password?
//             </h3>


//             <p>
//                 Are you sure you want
//                 to delete this password?
//             </p>


//             <div class="delete-buttons">

//                 <button
//                     id="cancelDelete"
//                     type="button"
//                 >
//                     Cancel
//                 </button>


//                 <button
//                     id="confirmDelete"
//                     type="button"
//                 >
//                     Delete
//                 </button>

//             </div>

//         </div>

//     `;


//     document.body.appendChild(box);


//     // =========================
//     // CANCEL
//     // =========================

//     document.getElementById(
//         "cancelDelete"
//     ).onclick = function () {

//         box.remove();

//     };


//     // =========================
//     // CONFIRM DELETE
//     // =========================

//     document.getElementById(
//         "confirmDelete"
//     ).onclick = function () {


//         savedPasswords =
//             savedPasswords.filter(
//                 function (item) {

//                     return item.id !== id;

//                 }
//             );


//         localStorage.setItem(
//             "savedPasswords",
//             JSON.stringify(savedPasswords)
//         );


//         showPasswords();


//         box.remove();

//     };

// }


// // =========================
// // SECURITY FUNCTION
// // =========================

// function escapeHTML(text) {

//     return String(text)

//         .replaceAll(
//             "&",
//             "&amp;"
//         )

//         .replaceAll(
//             "<",
//             "&lt;"
//         )

//         .replaceAll(
//             ">",
//             "&gt;"
//         )

//         .replaceAll(
//             '"',
//             "&quot;"
//         )

//         .replaceAll(
//             "'",
//             "&#039;"
//         );

// }




import { initializeApp } from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
    getAuth,
    onAuthStateChanged
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";

import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    setDoc,
    query,
    orderBy
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// =====================================================
// YOUR FIREBASE CONFIG
// =====================================================

const firebaseConfig = {

    apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",

    authDomain: "arshu-9919.firebaseapp.com",

    projectId: "arshu-9919",

    storageBucket: "arshu-9919.firebasestorage.app",

    messagingSenderId: "629782428750",

    appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",

    measurementId: "G-29KEM972QS"

};


// =====================================================
// START FIREBASE
// =====================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// =====================================================
// HTML ELEMENTS
// =====================================================

const website =
    document.getElementById("website");

const username =
    document.getElementById("username");

const password =
    document.getElementById("password");

const note =
    document.getElementById("note");

const saveBtn =
    document.getElementById("saveBtn");

const showPassword =
    document.getElementById("showPassword");

const passwordList =
    document.getElementById("passwordList");


// =====================================================
// CURRENT USER
// =====================================================

let currentUser = null;


// =====================================================
// SHOW / HIDE NEW PASSWORD
// =====================================================

showPassword.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            showPassword.textContent = "🙈";

        } else {

            password.type = "password";

            showPassword.textContent = "👁";

        }

    }
);


// =====================================================
// CHECK LOGIN
// =====================================================

onAuthStateChanged(
    auth,
    async function (user) {

        if (!user) {

            alert("Please login first.");

            return;

        }


        currentUser = user;


        console.log(
            "Logged in:",
            currentUser.email
        );


        await migrateOldPasswords();

        await showPasswords();

    }
);


// =====================================================
// SAVE PASSWORD
// =====================================================

saveBtn.addEventListener(
    "click",
    async function () {

        if (!currentUser) {

            alert("Please login first.");

            return;

        }


        if (
            website.value.trim() === "" ||
            username.value.trim() === "" ||
            password.value.trim() === ""
        ) {

            alert(
                "Website, Username aur Password bharo."
            );

            return;

        }


        try {

            const data = {

                website:
                    website.value.trim(),

                username:
                    username.value.trim(),

                password:
                    password.value,

                note:
                    note.value.trim(),

                createdAt:
                    Date.now()

            };


            // FIRESTORE ME SAVE

            await addDoc(

                collection(
                    db,
                    "users",
                    currentUser.uid,
                    "passwords"
                ),

                data

            );


            // INPUT CLEAR

            website.value = "";

            username.value = "";

            password.value = "";

            note.value = "";

            showPassword.textContent = "👁";


            // LIST RELOAD

            await showPasswords();


            alert("Password Saved!");

        }

        catch (error) {

            console.error(
                "Save error:",
                error
            );

            alert(
                "Password save nahi hua.\n\n" +
                error.message
            );

        }

    }
);


// =====================================================
// LOAD PASSWORDS FROM FIRESTORE
// =====================================================

async function showPasswords() {

    if (!currentUser) {

        return;

    }


    passwordList.innerHTML = "";


    try {

        const passwordRef =
            collection(
                db,
                "users",
                currentUser.uid,
                "passwords"
            );


        const q =
            query(
                passwordRef,
                orderBy("createdAt", "desc")
            );


        const snapshot =
            await getDocs(q);


        snapshot.forEach(
    function (firestoreDoc) {

        const item = {

            id: firestoreDoc.id,

            ...firestoreDoc.data()

        };


        const div =
            document.createElement("div");


                div.className =
                    "saved-item";


                div.innerHTML = `

                    <h3>
                        🌐 ${escapeHTML(item.website)}
                    </h3>

                    <p>
                        👤 ${escapeHTML(item.username)}
                    </p>


                    <div class="saved-password">

                        <span>🔑</span>

                        <input
                            type="password"
                            value="${escapeHTML(item.password)}"
                            readonly
                            id="pass-${item.id}"
                        >


                        <button
                            type="button"
                            onclick="toggleSavedPassword('${item.id}')"
                            id="show-${item.id}"
                        >
                            👁 Show
                        </button>

                    </div>


                    <p>
                        📝 ${escapeHTML(
                            item.note || "No note"
                        )}
                    </p>


                    <button
                        type="button"
                        class="delete-btn"
                        onclick="deletePassword('${item.id}')"
                    >
                        🗑 Delete
                    </button>

                `;


                passwordList.appendChild(div);

            }
        );

    }

    catch (error) {

        console.error(
            "Load error:",
            error
        );

        alert(
            "Passwords load nahi hue.\n\n" +
            error.message
        );

    }

}


// =====================================================
// SHOW / HIDE SAVED PASSWORD
// =====================================================

function toggleSavedPassword(id) {

    const input =
        document.getElementById(
            "pass-" + id
        );


    const button =
        document.getElementById(
            "show-" + id
        );


    if (!input || !button) {

        return;

    }


    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈 Hide";

    }

    else {

        input.type = "password";

        button.textContent = "👁 Show";

    }

}


// =====================================================
// DELETE PASSWORD
// =====================================================

function deletePassword(id) {

    if (!currentUser) {

        alert("Please login first.");

        return;

    }


    const box =
        document.createElement("div");


    box.className =
        "delete-popup";


    box.innerHTML = `

        <div class="delete-box">

            <h3>
                Delete Password?
            </h3>


            <p>
                Are you sure you want
                to delete this password?
            </p>


            <div class="delete-buttons">

                <button
                    id="cancelDelete"
                    type="button"
                >
                    Cancel
                </button>


                <button
                    id="confirmDelete"
                    type="button"
                >
                    Delete
                </button>

            </div>

        </div>

    `;


    document.body.appendChild(box);


    // CANCEL

    document.getElementById(
        "cancelDelete"
    ).onclick = function () {

        box.remove();

    };


    // CONFIRM DELETE

    document.getElementById(
        "confirmDelete"
    ).onclick = async function () {

        try {

            await deleteDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "passwords",
                    id
                )

            );


            await showPasswords();


            box.remove();


        }

        catch (error) {

            console.error(
                "Delete error:",
                error
            );

            alert(
                "Delete nahi hua.\n\n" +
                error.message
            );

        }

    };

}


// =====================================================
// OLD LOCAL STORAGE DATA
// FIREBASE ME TRANSFER
// =====================================================

async function migrateOldPasswords() {

    if (!currentUser) {

        return;

    }


    const migrationKey =
        "firestorePasswordsMigrated_" +
        currentUser.uid;


    if (
        localStorage.getItem(
            migrationKey
        )
    ) {

        return;

    }


    const oldData =
        JSON.parse(
            localStorage.getItem(
                "savedPasswords"
            )
        ) || [];


    if (oldData.length === 0) {

        localStorage.setItem(
            migrationKey,
            "true"
        );

        return;

    }


    try {

        for (
            const item of oldData
        ) {

            const data = {

                website:
                    item.website || "",

                username:
                    item.username || "",

                password:
                    item.password || "",

                note:
                    item.note || "",

                createdAt:
                    item.id || Date.now()

            };


            await setDoc(

                doc(
                    db,
                    "users",
                    currentUser.uid,
                    "passwords",
                    String(item.id)
                ),

                data

            );

        }


        localStorage.setItem(
            migrationKey,
            "true"
        );


        console.log(
            "Old passwords transferred to Firebase."
        );

    }

    catch (error) {

        console.error(
            "Migration error:",
            error
        );

    }

}


// =====================================================
// HTML SECURITY
// =====================================================

function escapeHTML(text) {

    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );

}


// =====================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// =====================================================

window.toggleSavedPassword =
    toggleSavedPassword;

window.deletePassword =
    deletePassword;


// // =========================
// // LOAD WHEN PAGE OPENS
// // =========================

// showPasswords();
