// const fileInput = document.getElementById("fileInput");
// const gallery = document.getElementById("gallery");

// fileInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (!file) return;

//     const img = document.createElement("img");
//     img.src = URL.createObjectURL(file);

//     img.style.width = "200px";
//     img.style.margin = "10px";

//     gallery.appendChild(img);

// });

// const fileInput = document.getElementById("fileInput");
// const gallery = document.getElementById("gallery");

// fileInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (!file) return;

//     const img = document.createElement("img");
//     img.src = URL.createObjectURL(file);

//     img.style.width = "200px";
//     img.style.margin = "10px";
//     img.style.cursor = "pointer";

//     // 👇 Photo par click karne par full size me open hoga
//     img.addEventListener("click", function () {
//         window.open(img.src, "_blank");
//     });

//     gallery.appendChild(img);

// });

// const fileInput = document.getElementById("fileInput");
// const gallery = document.getElementById("gallery");

// const popup = document.getElementById("popup");
// const popupImg = document.getElementById("popupImg");
// const close = document.getElementById("close");

// fileInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (!file) return;

//     const img = document.createElement("img");

//     img.src = URL.createObjectURL(file);

//     img.style.width = "200px";
//     img.style.height = "200px";
//     img.style.objectFit = "cover";
//     img.style.margin = "10px";
//     img.style.cursor = "pointer";

//     // Photo click
//     img.addEventListener("click", function () {

//         popup.style.display = "flex";

//         popupImg.src = img.src;

//     });

//     gallery.appendChild(img);

// });

// // Close Button
// close.addEventListener("click", function () {

//     popup.style.display = "none";

// });


// const downloadBtn = document.getElementById("downloadBtn");

// img.addEventListener("click", function () {

//     popup.style.display = "flex";
//     popupImg.src = img.src;

//     downloadBtn.onclick = function () {

//         const a = document.createElement("a");
//         a.href = img.src;
//         a.download = "photo";
//         a.click();

//     };

// });


// const fileInput = document.getElementById("fileInput");
// const gallery = document.getElementById("gallery");

// const popup = document.getElementById("popup");
// const popupImg = document.getElementById("popupImg");
// const close = document.getElementById("close");
// const downloadBtn = document.getElementById("downloadBtn");

// fileInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (!file) return;

//     const img = document.createElement("img");

//     img.src = URL.createObjectURL(file);

//     img.addEventListener("click", function(){

//         popup.style.display="flex";

//         popupImg.src=img.src;

//         downloadBtn.onclick=function(){

//             const a=document.createElement("a");

//             a.href=img.src;

//             a.download="photo";

//             a.click();

//         }

//     });

//     gallery.appendChild(img);

// });

// close.onclick=function(){

//     popup.style.display="none";





// const fileInput = document.getElementById("fileInput");
// const gallery = document.getElementById("gallery");

// const popup = document.getElementById("popup");
// const popupImg = document.getElementById("popupImg");
// const close = document.getElementById("close");
// const downloadBtn = document.getElementById("downloadBtn");
// const deleteBtn = document.getElementById("deleteBtn");

// fileInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (!file) return;

//     const img = document.createElement("img");

//     img.src = URL.createObjectURL(file);

//     img.style.width = "220px";
//     img.style.height = "220px";
//     img.style.objectFit = "cover";
//     img.style.borderRadius = "10px";
//     img.style.cursor = "pointer";

//     // Photo click
//     img.addEventListener("click", function () {

//         popup.style.display = "flex";
//         popupImg.src = img.src;

//         // Download
//         downloadBtn.onclick = function () {

//             const a = document.createElement("a");
//             a.href = img.src;
//             a.download = "photo";
//             a.click();

//         };

//         // Delete
//         deleteBtn.onclick = function () {

//             let check = confirm("Delete this photo?");

//             if (check) {
//                 img.remove();
//                 popup.style.display = "none";
//             }

//         };

//     });

//     gallery.appendChild(img);

// });

// // Close popup
// close.addEventListener("click", function () {

//     popup.style.display = "none";

// });

// // Popup ke bahar click karne par bhi band ho
// popup.addEventListener("click", function (e) {

//     if (e.target === popup) {
//         popup.style.display = "none";
//     }

// });



// // const fileInput = document.getElementById("fileInput");
// // const gallery = document.getElementById("gallery");

// // fileInput.addEventListener("change", function () {

// //     const file = this.files[0];

// //     if (!file) return;

// //     const img = document.createElement("img");
// //     img.src = URL.createObjectURL(file);

// //     img.style.width = "200px";
// //     img.style.margin = "10px";

// //     gallery.appendChild(img);

// // });

// // const fileInput = document.getElementById("fileInput");
// // const gallery = document.getElementById("gallery");

// // fileInput.addEventListener("change", function () {

// //     const file = this.files[0];

// //     if (!file) return;

// //     const img = document.createElement("img");
// //     img.src = URL.createObjectURL(file);

// //     img.style.width = "200px";
// //     img.style.margin = "10px";
// //     img.style.cursor = "pointer";

// //     // 👇 Photo par click karne par full size me open hoga
// //     img.addEventListener("click", function () {
// //         window.open(img.src, "_blank");
// //     });

// //     gallery.appendChild(img);

// // });

// // const fileInput = document.getElementById("fileInput");
// // const gallery = document.getElementById("gallery");

// // const popup = document.getElementById("popup");
// // const popupImg = document.getElementById("popupImg");
// // const close = document.getElementById("close");

// // fileInput.addEventListener("change", function () {

// //     const file = this.files[0];

// //     if (!file) return;

// //     const img = document.createElement("img");

// //     img.src = URL.createObjectURL(file);

// //     img.style.width = "200px";
// //     img.style.height = "200px";
// //     img.style.objectFit = "cover";
// //     img.style.margin = "10px";
// //     img.style.cursor = "pointer";

// //     // Photo click
// //     img.addEventListener("click", function () {

// //         popup.style.display = "flex";

// //         popupImg.src = img.src;

// //     });

// //     gallery.appendChild(img);

// // });

// // // Close Button
// // close.addEventListener("click", function () {

// //     popup.style.display = "none";

// // });


// // const downloadBtn = document.getElementById("downloadBtn");

// // img.addEventListener("click", function () {

// //     popup.style.display = "flex";
// //     popupImg.src = img.src;

// //     downloadBtn.onclick = function () {

// //         const a = document.createElement("a");
// //         a.href = img.src;
// //         a.download = "photo";
// //         a.click();

// //     };

// // });


// // const fileInput = document.getElementById("fileInput");
// // const gallery = document.getElementById("gallery");

// // const popup = document.getElementById("popup");
// // const popupImg = document.getElementById("popupImg");
// // const close = document.getElementById("close");
// // const downloadBtn = document.getElementById("downloadBtn");

// // fileInput.addEventListener("change", function () {

// //     const file = this.files[0];

// //     if (!file) return;

// //     const img = document.createElement("img");

// //     img.src = URL.createObjectURL(file);

// //     img.addEventListener("click", function(){

// //         popup.style.display="flex";

// //         popupImg.src=img.src;

// //         downloadBtn.onclick=function(){

// //             const a=document.createElement("a");

// //             a.href=img.src;

// //             a.download="photo";

// //             a.click();

// //         }

// //     });

// //     gallery.appendChild(img);

// // });

// // close.onclick=function(){

// //     popup.style.display="none";





// const fileInput = document.getElementById("fileInput");
// const gallery = document.getElementById("gallery");

// const popup = document.getElementById("popup");
// const popupImg = document.getElementById("popupImg");
// const close = document.getElementById("close");
// const downloadBtn = document.getElementById("downloadBtn");
// const deleteBtn = document.getElementById("deleteBtn");

// fileInput.addEventListener("change", function () {

//     const file = this.files[0];

//     if (!file) return;

//     const img = document.createElement("img");

//     img.src = URL.createObjectURL(file);

//     img.style.width = "220px";
//     img.style.height = "220px";
//     img.style.objectFit = "cover";
//     img.style.borderRadius = "10px";
//     img.style.cursor = "pointer";

//     // Photo click
//     img.addEventListener("click", function () {

//         popup.style.display = "flex";
//         popupImg.src = img.src;

//         // Download
//         downloadBtn.onclick = function () {

//             const a = document.createElement("a");
//             a.href = img.src;
//             a.download = "photo";
//             a.click();

//         };

//         // Delete
//         deleteBtn.onclick = function () {

//             let check = confirm("Delete this photo?");

//             if (check) {
//                 img.remove();
//                 popup.style.display = "none";
//             }

//         };

//     });

//     gallery.appendChild(img);

// });

// // Close popup
// close.addEventListener("click", function () {

//     popup.style.display = "none";

// });

// // Popup ke bahar click karne par bhi band ho
// popup.addEventListener("click", function (e) {

//     if (e.target === popup) {
//         popup.style.display = "none";
//     }

// });


// =====================================================
// FIREBASE
// =====================================================

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
    query,
    orderBy
} from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


// =====================================================
// FIREBASE CONFIG
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

const fileInput =
    document.getElementById("fileInput");

const gallery =
    document.getElementById("gallery");

const popup =
    document.getElementById("popup");

const popupImg =
    document.getElementById("popupImg");

const close =
    document.getElementById("close");

const downloadBtn =
    document.getElementById("downloadBtn");

const deleteBtn =
    document.getElementById("deleteBtn");


// =====================================================
// CURRENT USER
// =====================================================

let currentUser = null;

let selectedPhoto = null;


// =====================================================
// LOGIN CHECK
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

        await loadPhotos();

    }
);


// =====================================================
// PHOTO SELECT
// =====================================================

fileInput.addEventListener(
    "change",
    async function () {

        const file = this.files[0];

        if (!file) {
            return;
        }


        if (!currentUser) {

            alert("Please login first.");

            return;

        }


        // Only images

        if (!file.type.startsWith("image/")) {

            alert("Sirf photo select karo.");

            return;

        }


        try {

            // Compress photo

            const compressedPhoto =
                await compressImage(file);


            // Save to Firestore

            await addDoc(

                collection(
                    db,
                    "users",
                    currentUser.uid,
                    "photos"
                ),

                {

                    name: file.name,

                    type: "image/jpeg",

                    data: compressedPhoto,

                    createdAt: Date.now()

                }

            );


            // Reload photos

            await loadPhotos();


            alert("Photo saved!");

            fileInput.value = "";

        }

        catch (error) {

            console.error(
                "Photo save error:",
                error
            );

            alert(
                "Photo save nahi hui.\n\n" +
                error.message
            );

        }

    }
);


// =====================================================
// COMPRESS PHOTO
// =====================================================

function compressImage(file) {

    return new Promise(
        function (resolve, reject) {

            const reader =
                new FileReader();


            reader.onload =
                function (event) {

                    const img =
                        new Image();


                    img.onload =
                        function () {

                            const canvas =
                                document.createElement(
                                    "canvas"
                                );


                            let width =
                                img.width;

                            let height =
                                img.height;


                            // Maximum size

                            const maxSize =
                                1200;


                            if (
                                width >
                                maxSize ||
                                height >
                                maxSize
                            ) {

                                if (
                                    width >
                                    height
                                ) {

                                    height =
                                        height *
                                        maxSize /
                                        width;

                                    width =
                                        maxSize;

                                }

                                else {

                                    width =
                                        width *
                                        maxSize /
                                        height;

                                    height =
                                        maxSize;

                                }

                            }


                            canvas.width =
                                width;

                            canvas.height =
                                height;


                            const ctx =
                                canvas.getContext(
                                    "2d"
                                );


                            ctx.drawImage(
                                img,
                                0,
                                0,
                                width,
                                height
                            );


                            // JPEG compression

                            const dataUrl =
                                canvas.toDataURL(
                                    "image/jpeg",
                                    0.65
                                );


                            resolve(dataUrl);

                        };


                    img.onerror =
                        function () {

                            reject(
                                new Error(
                                    "Photo read nahi ho saki."
                                )
                            );

                        };


                    img.src =
                        event.target.result;

                };


            reader.onerror =
                function () {

                    reject(
                        new Error(
                            "File read nahi ho saki."
                        )
                    );

                };


            reader.readAsDataURL(file);

        }
    );

}


// =====================================================
// LOAD PHOTOS
// =====================================================

async function loadPhotos() {

    if (!currentUser) {
        return;
    }


    gallery.innerHTML = "";


    try {

        const photoCollection =
            collection(
                db,
                "users",
                currentUser.uid,
                "photos"
            );


        const q =
            query(
                photoCollection,
                orderBy(
                    "createdAt",
                    "desc"
                )
            );


        const snapshot =
            await getDocs(q);


        snapshot.forEach(
            function (firestoreDoc) {

                const photo =
                    firestoreDoc.data();


                const img =
                    document.createElement(
                        "img"
                    );


                img.src =
                    photo.data;


                img.style.width =
                    "220px";

                img.style.height =
                    "220px";

                img.style.objectFit =
                    "cover";

                img.style.borderRadius =
                    "10px";

                img.style.cursor =
                    "pointer";

                img.style.margin =
                    "10px";


                // Photo click

                img.addEventListener(
                    "click",
                    function () {

                        selectedPhoto = {

                            id:
                                firestoreDoc.id,

                            data:
                                photo.data,

                            name:
                                photo.name ||
                                "photo.jpg"

                        };


                        popup.style.display =
                            "flex";


                        popupImg.src =
                            photo.data;

                    }
                );


                gallery.appendChild(img);

            }
        );

    }

    catch (error) {

        console.error(
            "Photo load error:",
            error
        );

        alert(
            "Photos load nahi hui.\n\n" +
            error.message
        );

    }

}


// =====================================================
// CLOSE POPUP
// =====================================================

close.addEventListener(
    "click",
    function () {

        popup.style.display =
            "none";

        selectedPhoto = null;

    }
);


// =====================================================
// POPUP OUTSIDE CLICK
// =====================================================

popup.addEventListener(
    "click",
    function (event) {

        if (
            event.target === popup
        ) {

            popup.style.display =
                "none";

            selectedPhoto = null;

        }

    }
);


// =====================================================
// DOWNLOAD PHOTO
// =====================================================

downloadBtn.addEventListener(
    "click",
    function () {

        if (!selectedPhoto) {
            return;
        }


        const link =
            document.createElement(
                "a"
            );


        link.href =
            selectedPhoto.data;


        link.download =
            selectedPhoto.name ||
            "photo.jpg";


        document.body.appendChild(
            link
        );


        link.click();


        link.remove();

    }
);


// =====================================================
// DELETE PHOTO
// =====================================================

deleteBtn.addEventListener(
    "click",
    async function () {

        if (
            !selectedPhoto ||
            !currentUser
        ) {

            return;

        }


        const check =
            confirm(
                "Delete this photo?"
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
                    "photos",
                    selectedPhoto.id
                )

            );


            popup.style.display =
                "none";


            selectedPhoto = null;


            await loadPhotos();


            alert("Photo deleted.");

        }

        catch (error) {

            console.error(
                "Photo delete error:",
                error
            );

            alert(
                "Photo delete nahi hui.\n\n" +
                error.message
            );

        }

    }
);
