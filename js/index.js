// Parse JSON Web Token:
function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// Al iniciar sesión con Google:
function handleCredentialResponse(response) {
    localStorage.setItem("username", parseJwt(response.credential).name);
    window.location.href = "inicio.html";
}

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
        localStorage.setItem("username", document.getElementById("email").value);
        window.location.href = "inicio.html";
    } else {
        new bootstrap.Modal(document.getElementById("modal")).show();
    }
});