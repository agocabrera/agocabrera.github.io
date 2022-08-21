// Al iniciar sesión con Google:

function handleCredentialResponse(response) {
    window.location.href = "inicio.html";
};

// Al iniciar sesión con email/contraseña:

document.getElementById("submit").addEventListener("click", function () {
    let loginOk = true;
    let modalContentToAppend = "<p>Por favor ingrese:</p><ul>";

    if (document.getElementById("email").value == "") {
        loginOk = false;
        modalContentToAppend += "<li>Email</li>"
    }

    if (document.getElementById("password").value == "") {
        loginOk = false;
        modalContentToAppend += "<li>Contraseña</li>"
    }

    modalContentToAppend += '</ul><button type="button" class="btn btn-primary float-end" data-bs-dismiss="modal">Cerrar</button>';
    document.getElementById("modal-body").innerHTML = modalContentToAppend;

    if (loginOk) {
        window.location.href = "inicio.html";
    } else {
        new bootstrap.Modal(document.getElementById("modal")).show();
    }
});