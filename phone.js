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
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// =====================================
// FIREBASE CONFIG
// =====================================

const firebaseConfig = {

    apiKey: "AIzaSyDpdRnhuWp57slwtpIdRwS9W3pqpITr66s",

    authDomain: "arshu-9919.firebaseapp.com",

    projectId: "arshu-9919",

    storageBucket: "arshu-9919.firebasestorage.app",

    messagingSenderId: "629782428750",

    appId: "1:629782428750:web:4db3c0d9d68f89c75f971f",

    measurementId: "G-29KEM972QS"

};


// =====================================
// FIREBASE START
// =====================================

const app =
    initializeApp(firebaseConfig);

const auth =
    getAuth(app);

const db =
    getFirestore(app);


// =====================================
// HTML ELEMENTS
// =====================================

const nameInput =
    document.getElementById("name");

const phoneInput =
    document.getElementById("phone");

const noteInput =
    document.getElementById("note");

const saveButton =
    document.getElementById("saveNumber");

const numberList =
    document.getElementById("numberList");

const searchInput =
    document.getElementById("searchNumber");

const searchResult =
    document.getElementById("searchResult");


// =====================================
// VARIABLES
// =====================================

let currentUser = null;

let editingId = null;


// =====================================
// LOGIN CHECK
// =====================================

onAuthStateChanged(
    auth,
    async function(user) {

        if (!user) {

            window.location.replace(
                "index.html"
            );

            return;
        }


        currentUser = user;

        await loadNumbers();

    }
);


// =====================================
// SAVE / UPDATE NUMBER
// =====================================

saveButton.addEventListener(
    "click",
    async function() {

        const name =
            nameInput.value.trim();

        const phone =
            phoneInput.value.trim();

        const note =
            noteInput.value.trim();


        if (!name || !phone) {

            alert(
                "Name aur Phone Number bharo."
            );

            return;
        }


        try {

            const numbersRef =
                collection(
                    db,
                    "users",
                    currentUser.uid,
                    "numbers"
                );


            // =================================
            // UPDATE
            // =================================

            if (editingId) {

                await updateDoc(

                    doc(
                        db,
                        "users",
                        currentUser.uid,
                        "numbers",
                        editingId
                    ),

                    {
                        name: name,
                        phone: phone,
                        note: note,
                        updatedAt: Date.now()
                    }

                );

                alert("Number updated.");

            }


            // =================================
            // NEW NUMBER
            // =================================

            else {

                await addDoc(

                    numbersRef,

                    {
                        name: name,
                        phone: phone,
                        note: note,
                        createdAt: Date.now()
                    }

                );

                alert("Number saved.");

            }


            clearForm();

            await loadNumbers();

        }

        catch (error) {

            console.error(error);

            alert(
                "Number save nahi hua:\n" +
                error.message
            );

        }

    }
);


// =====================================
// LOAD NUMBERS
// =====================================

async function loadNumbers() {

    if (!currentUser) {
        return;
    }


    numberList.innerHTML = "";


    try {

        const numbersRef =
            collection(
                db,
                "users",
                currentUser.uid,
                "numbers"
            );


        const q =
            query(
                numbersRef,
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(q);


        if (snapshot.empty) {

            numberList.innerHTML =
                "<p style='text-align:center;'>No numbers saved.</p>";

            if (searchResult) {
                searchResult.textContent = "";
            }

            return;
        }


        snapshot.forEach(
            function(numberDoc) {

                const data =
                    numberDoc.data();


                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "number-item";


                // =================================
                // NAME
                // =================================

                const title =
                    document.createElement(
                        "h3"
                    );

                title.textContent =
                    "👤 " + (data.name || "");


                // =================================
                // PHONE
                // =================================

                const phone =
                    document.createElement(
                        "p"
                    );

                phone.textContent =
                    "📞 " + (data.phone || "");


                // =================================
                // NOTE
                // =================================

                const note =
                    document.createElement(
                        "p"
                    );

                note.textContent =
                    "📝 " +
                    (
                        data.note ||
                        "No note"
                    );


                // =================================
                // BUTTONS
                // =================================

                const buttons =
                    document.createElement(
                        "div"
                    );

                buttons.className =
                    "buttons";


                // EDIT BUTTON

                const editButton =
                    document.createElement(
                        "button"
                    );

                editButton.textContent =
                    "Edit";

                editButton.className =
                    "edit-btn";


                // DELETE BUTTON

                const deleteButton =
                    document.createElement(
                        "button"
                    );

                deleteButton.textContent =
                    "Delete";

                deleteButton.className =
                    "delete-btn";


                // =================================
                // EDIT CLICK
                // =================================

                editButton.onclick =
                    function() {

                        editNumber(
                            numberDoc.id,
                            data
                        );

                    };


                // =================================
                // DELETE CLICK
                // =================================

                deleteButton.onclick =
                    function() {

                        deleteNumber(
                            numberDoc.id
                        );

                    };


                buttons.appendChild(
                    editButton
                );

                buttons.appendChild(
                    deleteButton
                );


                item.appendChild(
                    title
                );

                item.appendChild(
                    phone
                );

                item.appendChild(
                    note
                );

                item.appendChild(
                    buttons
                );


                numberList.appendChild(
                    item
                );

            }
        );


        // Search ko dobara apply karo
        applySearch();

    }

    catch (error) {

        console.error(error);

        alert(
            "Numbers load nahi hue:\n" +
            error.message
        );

    }

}


// =====================================
// SEARCH
// =====================================

function applySearch() {

    if (!searchInput) {
        return;
    }


    const search =
        searchInput.value
            .trim()
            .toLowerCase();


    const items =
        document.querySelectorAll(
            ".number-item"
        );


    let found = 0;


    items.forEach(
        function(item) {

            const text =
                item.textContent
                    .toLowerCase();


            if (
                search === "" ||
                text.includes(search)
            ) {

                item.style.display =
                    "block";


                if (search !== "") {

                    found++;

                }

            }

            else {

                item.style.display =
                    "none";

            }

        }
    );


    // =================================
    // SEARCH RESULT MESSAGE
    // =================================

    if (!searchResult) {
        return;
    }


    if (search === "") {

        searchResult.textContent = "";

    }

    else if (found === 1) {

        searchResult.textContent =
            "1 result found";

    }

    else if (found > 1) {

        searchResult.textContent =
            found + " results found";

    }

    else {

        searchResult.textContent =
            "No number found";

    }

}


// Search typing
if (searchInput) {

    searchInput.addEventListener(
        "input",
        function() {

            applySearch();

        }
    );

}


// =====================================
// EDIT NUMBER
// =====================================

function editNumber(
    id,
    data
) {

    editingId = id;


    nameInput.value =
        data.name || "";


    phoneInput.value =
        data.phone || "";


    noteInput.value =
        data.note || "";


    saveButton.textContent =
        "Update Number";


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


// =====================================
// DELETE NUMBER
// =====================================

async function deleteNumber(id) {

    const check =
        confirm(
            "Kya ye number delete karna hai?"
        );


    if (!check) {
        return;
    }


    try {

        await deleteDoc(

            doc(
                db,
                "users",
                currentUser.uid,
                "numbers",
                id
            )

        );


        await loadNumbers();


        alert(
            "Number deleted."
        );

    }

    catch (error) {

        console.error(error);

        alert(
            "Delete nahi hua:\n" +
            error.message
        );

    }

}


// =====================================
// CLEAR FORM
// =====================================

function clearForm() {

    nameInput.value = "";

    phoneInput.value = "";

    noteInput.value = "";

    editingId = null;

    saveButton.textContent =
        "Save Number";

}