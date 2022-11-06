// Parse JSON Web Token.
function parseJwt(token) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

// Al iniciar sesión con Google.
function handleCredentialResponse(response) {
    let userData = parseJwt(response.credential)

    loginUser(userData.email, userData.given_name, userData.family_name);
    window.location.href = "inicio.html";
}

// Si el email ingresado coincide con el email de uno de los usuarios en 
// el almacenamiento local, establecer ese usuario como activo, sino
// crear un usuario nuevo con los datos ingresados.
function loginUser(email, name, surname) {

    if (localStorage.getItem("user-" + email) === null) {

        let newUser = {
            email: email,
            name: name,
            secondName: "",
            surname: surname,
            secondSurname: "",
            phoneNumber: "",
            profilePicture: "",
            cart: []
        }

        localStorage.setItem("user-" + email, JSON.stringify(newUser));
        localStorage.setItem("active-user", email);

    } else {

        localStorage.setItem("active-user", email);

    }

}

document.addEventListener("DOMContentLoaded", function () {

    // Al iniciar sesión con email/contraseña.
    document.getElementById("submit").addEventListener("click", function () {
        const emailInput = document.getElementById("email");
        const passwordInput = document.getElementById("password");
        const errorModal = new bootstrap.Modal(document.getElementById("error-modal"));
        let modalContentToAppend = "";
        let loginOk = true;

        if (!emailInput.checkValidity()) {
            loginOk = false;
            modalContentToAppend += "<li>Email válido</li>";
        }

        if (!passwordInput.checkValidity()) {
            loginOk = false;
            modalContentToAppend += "<li>Contraseña</li>";
        }

        document.getElementById("error-modal-body").innerHTML = modalContentToAppend;

        if (loginOk) {
            loginUser(emailInput.value, "", "");
            window.location.href = "inicio.html";
        } else {
            errorModal.show();
        }

    });

}, false);