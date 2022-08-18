document.getElementById("submit").addEventListener("click", function () {
    let loginOk = true;
    let errorMsg = "Los siguientes campos no pueden estar vacíos: \n";

    if (document.getElementById("email").value == "") {
        loginOk = false;
        errorMsg += "- Email \n";
    }

    if (document.getElementById("password").value == "") {
        loginOk = false;
        errorMsg += "- Contraseña";
    }

    if (loginOk) {
        window.location.href = "inicio.html";
    } else {
        alert(errorMsg);
    }

});