// Codificar archivo a texto Base64.
function toBase64(file) {
    return new Promise(function (resolve) {
        const reader = new FileReader;
        reader.readAsDataURL(file);
        reader.onload = (event) => { resolve(event.target.result); }
    });
}

// Mostrar alerta de éxito o error según el parámetro.
function showAlert(success) {
    const alert = document.createElement("div");
    alert.classList.add("alert", success ? "alert-success" : "alert-danger", "fade", "show");
    alert.setAttribute("role", "alert");
    alert.appendChild(document.createTextNode(success ? "Datos actualizados." : "Los campos requeridos no pueden estar vacíos."));
    document.body.appendChild(alert);

    // NodeList de elementos con clase alert, por si se llama de nuevo
    // a la función antes de cerrar la última alerta.
    const alertNodeList = document.querySelectorAll(".alert");
    // Transformar NodeList a array para poder usar map().
    const alertArray = Array.from(alertNodeList);
    // Array.map() los elementos a alertas de Bootstrap.
    const bsAlertArray = alertArray.map(element => new bootstrap.Alert(element));
    // Desechar las alertas después de unos segundos.
    bsAlertArray.forEach(element => setTimeout(() => { element.close(); element.dispose(); }, 2500));

}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {

    // Controles del usuario en la barra de navegación.
    userControls();

    // Obtener los datos del usuario que inició sesión desde el almacenamiento local.
    const activeUser = JSON.parse(localStorage.getItem("user-" + localStorage.getItem("active-user")));

    // Llenar los campos con los datos del usuario.
    document.getElementById("name").value = activeUser.name;
    document.getElementById("second-name").value = activeUser.secondName;
    document.getElementById("surname").value = activeUser.surname;
    document.getElementById("second-surname").value = activeUser.secondSurname;
    document.getElementById("email").value = activeUser.email;
    document.getElementById("phone-number").value = activeUser.phoneNumber;

    // Mostrar imagen de perfil si existe.
    if (activeUser.profilePicture !== "") {
        document.getElementById("profile-picture").src = activeUser.profilePicture
    }

    // Al hacer click en "Guardar cambios"...
    document.getElementById("save-changes").addEventListener("click", async function () {
        const needsValidationList = document.querySelectorAll(".needs-validation");

        // Revisar que los campos requeridos sean válidos.
        if (!document.getElementById("name").checkValidity() ||
            !document.getElementById("surname").checkValidity() ||
            !document.getElementById("email").checkValidity()) {

            needsValidationList.forEach(element => element.classList.add("was-validated"));
            showAlert(false);
            return;

        }

        const pictureInput = document.getElementById("picture-input");
        const selectedPicture = pictureInput.files[0];

        // Si se eligió un archivo...
        if (selectedPicture !== undefined) {

            // ...y el archivo es una imagen PNG o JPEG...
            if (selectedPicture.type === "image/png" || selectedPicture.type === "image/jpeg") {

                const base64Picture = await toBase64(selectedPicture);
                activeUser.profilePicture = base64Picture;
                document.getElementById("profile-picture").src = base64Picture;

            } else {

                document.getElementById("picture-error").classList.remove("d-none");
                return;

            }

        }

        // Quitar los datos del usuario del almacenamiento local, por si cambia el email.
        localStorage.removeItem("user-" + activeUser.email);

        activeUser.name = document.getElementById("name").value;
        activeUser.secondName = document.getElementById("second-name").value;
        activeUser.surname = document.getElementById("surname").value;
        activeUser.secondSurname = document.getElementById("second-surname").value;
        activeUser.email = document.getElementById("email").value;
        activeUser.phoneNumber = document.getElementById("phone-number").value;

        // Guardar los nuevos datos del usuario en el almacenamiento local.
        localStorage.setItem("user-" + activeUser.email, JSON.stringify(activeUser));
        localStorage.setItem("active-user", activeUser.email);

        document.getElementById("picture-error").classList.add("d-none");
        needsValidationList.forEach(element => element.classList.remove("was-validated"));
        showAlert(true);

    }, false);

});