// Objeto con los datos del usuario que inició sesión,
// incluyendo el contenido de su carrito.
let activeUser = {};

// Booleano que se vuelve verdadero cuando se verifican
// los inputs de la página.
let inputsVerified = false;

// Calcular el subtotal del carrito en dólares, guardarlo 
// junto al resto de los datos del usuario y mostrarlo en la página.
function setCartSubtotal(array) {
    let subtotal = 0;

    for (let i = 0; i < array.length; i++) {
        let item = array[i];

        if (item.currency === "USD") {
            subtotal += item.unitCost * item.count;
        }

        if (item.currency === "UYU") {
            subtotal += (item.unitCost / 40) * item.count;
        }

    }

    activeUser.cartSubtotal = subtotal;
    localStorage.setItem("user-" + activeUser.email, JSON.stringify(activeUser));

    document.getElementById("subtotal-cost").innerHTML = subtotal.toLocaleString("es-UY", { style: "currency", currency: "USD" });
    setShippingCost(subtotal);
}

// Calcular el costo de envío a partir del subtotal del carrito y
// el tipo de envío seleccionado y mostrarlo en la página.
function setShippingCost(subtotal) {
    let shippingMethod = document.querySelector("input[name=shipping-method]:checked");
    let shippingCost;

    if (shippingMethod === null) {
        return;
    } else if (shippingMethod.value === "1") {
        shippingCost = subtotal * 0.05;
    } else if (shippingMethod.value === "2") {
        shippingCost = subtotal * 0.07;
    } else if (shippingMethod.value === "3") {
        shippingCost = subtotal * 0.15;
    }

    document.getElementById("shipping-cost").innerHTML = shippingCost.toLocaleString("es-UY", { style: "currency", currency: "USD" });
    setTotalCost(subtotal, shippingCost);
}

// Calcular el costo total a partir del subtotal y el costo
// de envío y mostrarlo en la página.
function setTotalCost(subtotal, shippingCost) {
    let total = subtotal + shippingCost;

    document.getElementById("total-cost").innerHTML = total.toLocaleString("es-UY", { style: "currency", currency: "USD" });
}

// Mostrar los ítems del carrito en la página.
// Agregar un event listener a cada <input> que tiene la cantidad de 
// ese ítem y también a cada <button> que quita ese ítem del carrito.
function showCartItems(array) {
    document.getElementById("cart-items").innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        document.getElementById("cart-items").innerHTML +=
            `<tr>
                <td><img src="${item.image}" class="mx-auto d-block" onclick="setId('product', ${item.id})"></td>
                <td>${item.name}</td>
                <td class="number-font">${item.unitCost.toLocaleString("es-UY", { style: "currency", currency: item.currency, minimumFractionDigits: 0 })}</td>
                <td>
                    <div class="input-group input-group-sm needs-validation">
                        <input type="number" class="form-control item-count number-font" data-product-id="${item.id}" min="1" value="${item.count}" required>
                    </div>
                </td>
                <td class="number-font">${(item.unitCost * item.count).toLocaleString("es-UY", { style: "currency", currency: item.currency, minimumFractionDigits: 0 })}</td>
                <td><button type="button" class="item-remove" data-product-id="${item.id}"><span class="fa fa-trash"></span></button></td>
            </tr>`;
    }

    let countClassCollection = document.getElementsByClassName("item-count");
    for (let i = 0; i < countClassCollection.length; i++) {
        let inputElement = countClassCollection[i];
        inputElement.addEventListener("change", updateItemCount, false);
    }

    let removeClassCollection = document.getElementsByClassName("item-remove");
    for (let i = 0; i < removeClassCollection.length; i++) {
        let buttonElement = removeClassCollection[i];
        buttonElement.addEventListener("click", removeItemFromCart, false);
    }

    setCartSubtotal(array);
}

// Actualizar la cantidad del ítem en el carrito.
// Obtiene el ID del ítem a partir del dataset del target del evento, usa ese
// ID para encontrar el ítem en la lista del carrito y actualiza su cantidad
// siempre y cuando sea un número válido.
function updateItemCount(event) {
    let itemToUpdateId = parseInt(event.target.dataset.productId);
    let itemToUpdate = activeUser.cart.find((item) => { return item.id === itemToUpdateId });
    let newCount = parseInt(event.target.value);

    if (!(Number.isNaN(newCount) || newCount < 1)) {
        itemToUpdate.count = newCount;
        localStorage.setItem("user-" + activeUser.email, JSON.stringify(activeUser));
        showCartItems(activeUser.cart);
    } else {
        event.target.value = itemToUpdate.count;
    }
}

// Quitar el ítem del carrito asociado al botón.
// Obtiene el ID del ítem a partir del dataset del target del evento, usa ese 
// ID para encontrar el ítem en la lista del carrito y quitarlo.
function removeItemFromCart(event) {
    let itemToRemoveId = parseInt(event.target.dataset.productId);
    let itemToRemoveIndex = activeUser.cart.findIndex((item) => { return item.id === itemToRemoveId });

    activeUser.cart.splice(itemToRemoveIndex, 1);
    localStorage.setItem("user-" + activeUser.email, JSON.stringify(activeUser));
    showCartItems(activeUser.cart);
}

// Quitar ítems duplicados de la lista del carrito.
function removeCartDuplicates(array) {
    let uniqueIds = [];

    return array.filter(function (item) {
        if (uniqueIds.includes(item.id)) {
            return false;
        } else {
            uniqueIds.push(item.id);
            return true;
        }
    });

}

// Verificar si los inputs del form recibido no están vacíos.
function hasInvalidInputs(form) {

    for (input of form.querySelectorAll("input")) {
        if (input.type === "text" && input.value === "") {
            return true;
        }
    }

    return false;
}

// Verificar que todos los inputs de la página sean válidos.
function verifyAllInputs() {
    inputsVerified = true;

    // Input de cantidad de cada ítem del carrito.
    for (input of document.getElementsByClassName("item-count")) {
        let count = parseInt(input.value);
        if (Number.isNaN(count) || count < 1) {
            return false;
        }
    }

    // Inputs de la dirección de envío.
    if (hasInvalidInputs(document.getElementById("address-form"))) {
        return false;
    }

    // Inputs del tipo de envío.
    if (document.querySelector("input[name=shipping-method]:checked") === null) {
        return false;
    }

    // Inputs de forma de pago.
    let paymentMethodInput = document.querySelector("input[name=payment-method-input]:checked");
    if (paymentMethodInput === null) {
        return false;

    } else if (paymentMethodInput.value === "1") {
        if (hasInvalidInputs(document.getElementById("card-form"))) {
            return false;
        }

    } else if (paymentMethodInput.value === "2") {
        if (hasInvalidInputs(document.getElementById("bank-form"))) {
            return false;
        }
    }

    return true;

}

// Objeto que contiene los datos y métodos relacionados a la forma de pago y su feedback.
const payment = {
    selectedMethod: document.querySelector("input[name=payment-method-input]:checked"),
    methodMessage: document.getElementById("payment-method-display"),
    setMethod: function () {
        // Cambiar entre formas de pago.

        this.selectedMethod = document.querySelector("input[name=payment-method-input]:checked");

        if (this.selectedMethod.value === "1") {
            this.enabledForm = document.querySelector("#card-form");
            this.disabledForm = document.querySelector("#bank-form");
            this.methodMessage.innerHTML = "Tarjeta de crédito.";
        } else if (this.selectedMethod.value === "2") {
            this.enabledForm = document.querySelector("#bank-form");
            this.disabledForm = document.querySelector("#card-form");
            this.methodMessage.innerHTML = "Transferencia bancaria.";
        }

        this.enabledForm.querySelectorAll("input").forEach(el => {
            el.removeAttribute("disabled");
            el.setAttribute("required", "true");
        });

        this.disabledForm.querySelectorAll("input").forEach(el => {
            el.setAttribute("disabled", "true");
            el.removeAttribute("required")
        });

        if (inputsVerified) {
            this.enabledForm.classList.add("was-validated");
            this.disabledForm.classList.remove("was-validated");
        }

        this.methodMessageFeedback();

    }, methodMessageFeedback: function () {
        // Mostrar feedback en el mensaje de forma de pago seleccionada.

        if (!inputsVerified) return;
        if (this.selectedMethod === null) {
            this.methodMessage.classList.add("text-danger");
            return;
        }

        if (hasInvalidInputs(this.enabledForm)) {
            this.methodMessage.classList.remove("text-success");
            this.methodMessage.classList.add("text-danger");
        } else {
            this.methodMessage.classList.remove("text-danger");
            this.methodMessage.classList.add("text-success");
        }

    }

}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {

    // Mostrar controles del usuario en la barra de navegación.
    showUserControls();

    // Obtener los datos del usuario que inició sesión desde el almacenamiento local.
    activeUser = JSON.parse(localStorage.getItem("user-" + localStorage.getItem("active-user")));

    // Si el usuario no inició sesión, mostrar una alerta.
    if (activeUser === null) {

        document.querySelector("main").innerHTML =
            `<div class="alert alert-primary" role="alert">
                Debe <a href="index.html" class="alert-link">iniciar sesión</a> para acceder a su carrito.
            </div>`;

        return;

    }

    // Solicitar la lista remota del carrito, concatenarla con la lista local, quitar ítems duplicados
    // si los hay, actualizar la lista local con esta lista nueva y por último mostrarla en la página.
    getJSONData(CART_INFO_URL + 25801 + EXT_TYPE).then(function (resultObj) {

        if (resultObj.status === "ok") {

            activeUser.cart = activeUser.cart.concat(resultObj.data.articles);
            activeUser.cart = removeCartDuplicates(activeUser.cart);
            localStorage.setItem("user-" + activeUser.email, JSON.stringify(activeUser));

            showCartItems(activeUser.cart);

        } else {
            document.getElementById("cart-items").innerHTML = "No se ha podido cargar el carrito.";
        }

    });

    // Al cambiar el tipo de envío, actualizar los costos.
    document.querySelectorAll("input[name=shipping-method]").forEach(el => {
        el.addEventListener("change", () => setShippingCost(activeUser.cartSubtotal));
    });

    // Al cambiar la forma de pago, habilitar y deshabilitar los campos correspondientes.
    document.querySelectorAll("input[name=payment-method-input]").forEach(el => {
        el.addEventListener("change", () => { payment.setMethod() });
    });

    // Cuando se escribe en los campos de las formas de pago, dar feedback en tiempo real.
    document.querySelectorAll("#payment-modal .modal-body input[type=text]").forEach(el => {
        el.addEventListener("input", () => { payment.methodMessageFeedback() });
    });

    // Cuando ocurre el "submit" del formulario de dirección de envío...
    document.getElementById("address-form").addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        // Si todos los inputs son válidos mostrar la alerta de éxito, sino agregar la clase 
        // de Bootstrap "was-validated" a los elementos que contengan los inputs evaluados.
        if (verifyAllInputs()) {
            document.getElementById("purchase-success").classList.add("show");
            document.getElementById("purchase-success").classList.remove("d-none");
        } else {
            document.querySelectorAll(".needs-validation").forEach(el => el.classList.add("was-validated"));
            payment.methodMessageFeedback();
        }

    }, false);

    // Recargar la página al cerrar la alerta de éxito.
    document.getElementById("close-alert").addEventListener("click", function () {
        location.reload();
    }, false);

}, false);