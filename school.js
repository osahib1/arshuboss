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





const fileInput = document.getElementById("fileInput");
const gallery = document.getElementById("gallery");

const popup = document.getElementById("popup");
const popupImg = document.getElementById("popupImg");
const close = document.getElementById("close");
const downloadBtn = document.getElementById("downloadBtn");
const deleteBtn = document.getElementById("deleteBtn");

fileInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const img = document.createElement("img");

    img.src = URL.createObjectURL(file);

    img.style.width = "220px";
    img.style.height = "220px";
    img.style.objectFit = "cover";
    img.style.borderRadius = "10px";
    img.style.cursor = "pointer";

    // Photo click
    img.addEventListener("click", function () {

        popup.style.display = "flex";
        popupImg.src = img.src;

        // Download
        downloadBtn.onclick = function () {

            const a = document.createElement("a");
            a.href = img.src;
            a.download = "photo";
            a.click();

        };

        // Delete
        deleteBtn.onclick = function () {

            let check = confirm("Delete this photo?");

            if (check) {
                img.remove();
                popup.style.display = "none";
            }

        };

    });

    gallery.appendChild(img);

});

// Close popup
close.addEventListener("click", function () {

    popup.style.display = "none";

});

// Popup ke bahar click karne par bhi band ho
popup.addEventListener("click", function (e) {

    if (e.target === popup) {
        popup.style.display = "none";
    }

});