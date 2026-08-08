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


// =========================
// LOAD SAVED PASSWORDS
// =========================

let savedPasswords =
    JSON.parse(
        localStorage.getItem("savedPasswords")
    ) || [];


// =========================
// SHOW / HIDE NEW PASSWORD
// =========================

showPassword.addEventListener(
    "click",
    function () {

        if (password.type === "password") {

            password.type = "text";

            showPassword.textContent = "🙈";

        }

        else {

            password.type = "password";

            showPassword.textContent = "👁";

        }

    }
);


// =========================
// SAVE PASSWORD
// =========================

saveBtn.addEventListener(
    "click",
    function () {

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


        const data = {

            id: Date.now(),

            website: website.value,

            username: username.value,

            password: password.value,

            note: note.value

        };


        savedPasswords.push(data);


        localStorage.setItem(
            "savedPasswords",
            JSON.stringify(savedPasswords)
        );


        // CLEAR INPUTS

        website.value = "";

        username.value = "";

        password.value = "";

        note.value = "";

        showPassword.textContent = "👁";


        showPasswords();


        alert("Password Saved!");

    }
);


// =========================
// SHOW SAVED PASSWORDS
// =========================

function showPasswords() {

    passwordList.innerHTML = "";


    savedPasswords.forEach(
        function (item) {

            const div =
                document.createElement("div");


            div.className = "saved-item";


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
                        onclick="toggleSavedPassword(${item.id})"
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
                    onclick="deletePassword(${item.id})"
                >
                    🗑 Delete
                </button>

            `;


            passwordList.appendChild(div);

        }
    );

}


// =========================
// SHOW / HIDE SAVED PASSWORD
// =========================

function toggleSavedPassword(id) {

    const input =
        document.getElementById(
            "pass-" + id
        );


    const button =
        document.getElementById(
            "show-" + id
        );


    if (input.type === "password") {

        input.type = "text";

        button.textContent = "🙈 Hide";

    }

    else {

        input.type = "password";

        button.textContent = "👁 Show";

    }

}


// =========================
// DELETE PASSWORD
// =========================

function deletePassword(id) {


    // CREATE POPUP

    const box =
        document.createElement("div");


    box.className = "delete-popup";


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


    // =========================
    // CANCEL
    // =========================

    document.getElementById(
        "cancelDelete"
    ).onclick = function () {

        box.remove();

    };


    // =========================
    // CONFIRM DELETE
    // =========================

    document.getElementById(
        "confirmDelete"
    ).onclick = function () {


        savedPasswords =
            savedPasswords.filter(
                function (item) {

                    return item.id !== id;

                }
            );


        localStorage.setItem(
            "savedPasswords",
            JSON.stringify(savedPasswords)
        );


        showPasswords();


        box.remove();

    };

}


// =========================
// SECURITY FUNCTION
// =========================

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


// =========================
// LOAD WHEN PAGE OPENS
// =========================

showPasswords();