document.getElementById("logout").addEventListener("click", function () {

    let check = confirm("Kya aap logout karna chahte hain?");

    if (check) {
        window.location.href = "index.html";
    }

});