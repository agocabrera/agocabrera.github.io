// Objeto con los datos del usuario que inició sesión,
// incluyendo el contenido de su carrito.
let activeUser = {};

// Booleano que cambia una vez que la página pasa 
// por el proceso de verificación de validez.
let inputsVerified = false;

// Calcular el subtotal general a partir de la lista del carrito.
function calcSubtotalCost(array) {
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

    return subtotal;

}

// Calcular el costo de envío a partir del subtotal general y
// el tipo de envío seleccionado.
function calcShippingCost(subtotal) {
    let shippingMethod = document.querySelector("input[name=shipping-method]:checked");

    if (shippingMethod === null) {
        return "Seleccione tipo de envío.";
    } else if (shippingMethod.value === "3") {
        return subtotal * 0.15;
    } else if (shippingMethod.value === "2") {
        return subtotal * 0.07;
    } else if (shippingMethod.value === "1") {
        return subtotal * 0.05;
    }

}

// Actualizar el costo de envío y total en la página.
function showShippingAndTotalCost() {
    let subtotal = calcSubtotalCost(activeUser.cart);
    let shippingCost = calcShippingCost(subtotal);
    let total = subtotal + shippingCost;

    document.getElementById("shipping-cost").innerHTML = shippingCost.toLocaleString("es-UY", { style: "currency", currency: "USD" });

    if (typeof total === "number") {
        document.getElementById("total-cost").innerHTML = total.toLocaleString("es-UY", { style: "currency", currency: "USD" });
    }

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
                    <div class="input-group input-group-sm">
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
        inputElement.addEventListener("change", updateCount, false);
    }

    let removeClassCollection = document.getElementsByClassName("item-remove");
    for (let i = 0; i < removeClassCollection.length; i++) {
        let buttonElement = removeClassCollection[i];
        buttonElement.addEventListener("click", removeItemFromCart, false);
    }

    document.getElementById("subtotal-cost").innerHTML = calcSubtotalCost(array).toLocaleString("es-UY", { style: "currency", currency: "USD" });
    showShippingAndTotalCost();

}

// Función callback que actualiza la cantidad del ítem en el carrito.
// Obtiene el ID del ítem a partir del dataset del target del evento, usa ese
// ID para encontrar el ítem en la lista del carrito y actualiza su cantidad
// siempre y cuando sea un número válido.
function updateCount(event) {
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

// Función callback que quita el ítem del carrito asociado al botón.
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

// Revisar si algún input de texto anidado en el elemento  
// recibido como argumento está vacío.
function textInputsEmpty(form) {
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
    if (textInputsEmpty(document.getElementById("address-form"))) {
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
        if (textInputsEmpty(document.getElementById("card-form"))) {
            return false;
        }

    } else if (paymentMethodInput.value === "2") {
        if (textInputsEmpty(document.getElementById("bank-form"))) {
            return false;
        }
    }

    return true;

}

// Deshabilitar los inputs de la forma de pago que no está seleccionada y dar
// feedback si el formulario no fue válido al intentar enviarse una vez.
function paymentMethodFeedback() {
    let paymentMethodInput = document.querySelector("input[name=payment-method-input]:checked");
    let paymentMethodDisplay = document.getElementById("payment-method-display");
    let cardForm = document.getElementById("card-form");
    let bankForm = document.getElementById("bank-form");
    let enabledForm;
    let disabledForm;

    if (paymentMethodInput === null) {
        paymentMethodDisplay.classList.add("text-danger");
        return;
    } else if (paymentMethodInput.value === "1") {
        paymentMethodDisplay.innerHTML = "Tarjeta de crédito.";
        disabledForm = bankForm;
        enabledForm = cardForm;
    } else if (paymentMethodInput.value === "2") {
        paymentMethodDisplay.innerHTML = "Transferencia bancaria.";
        disabledForm = cardForm;
        enabledForm = bankForm;
    }

    // Deshabilitar los inputs para la forma de pago no seleccionada y
    // quitarle los event listeners.
    for (input of disabledForm.querySelectorAll("input")) {
        input.setAttribute("disabled", "");
        input.removeEventListener("input", paymentMethodFeedback, false);
    }

    // Hacer lo opuesto para la forma de pago seleccionada.
    for (input of enabledForm.querySelectorAll("input")) {
        input.removeAttribute("disabled");
        input.addEventListener("input", paymentMethodFeedback, false);
    }

    // Dar feedback si se intentó finalizar la compra previamente.
    if (inputsVerified) {
        disabledForm.classList.remove("was-validated");
        enabledForm.classList.add("was-validated");

        if (!textInputsEmpty(enabledForm)) {
            paymentMethodDisplay.classList.remove("text-danger");
            paymentMethodDisplay.classList.add("text-success");
        } else {
            paymentMethodDisplay.classList.remove("text-success");
            paymentMethodDisplay.classList.add("text-danger");
        }

    }

}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {

    // Controles del usuario en la barra de navegación.
    userControls();

    // Obtener los datos del usuario que inició sesión desde el almacenamiento local.
    activeUser = JSON.parse(localStorage.getItem("user-" + localStorage.getItem("active-user")));

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

    // Actualizar costo de envío al cambiar tipo de envío.
    document.getElementById("shipping-premium").addEventListener("change", showShippingAndTotalCost, false);
    document.getElementById("shipping-express").addEventListener("change", showShippingAndTotalCost, false);
    document.getElementById("shipping-standard").addEventListener("change", showShippingAndTotalCost, false);

    // Al seleccionar una forma de pago, llamar a la función que se 
    // encarga de desactivar la otra y del feedback.
    document.getElementById("payment-card").addEventListener("change", paymentMethodFeedback, false);
    document.getElementById("payment-bank").addEventListener("change", paymentMethodFeedback, false);

    // Cuando el formulario de dirección de envío se intenta enviar...
    document.getElementById("address-form").addEventListener("submit", function (event) {

        event.preventDefault();
        event.stopPropagation();

        // Si al menos un input no es válido, agregar la clase de Bootstrap "was-validated" a
        // los elementos que contengan los inputs evaluados, sino mostrar la alerta de éxito.
        if (verifyAllInputs()) {
            document.getElementById("purchase-success").classList.remove("d-none");
        } else {
            document.getElementById("cart-items").classList.add("was-validated");
            document.getElementById("address-form").classList.add("was-validated");
            document.getElementById("shipping-method").classList.add("was-validated");
            paymentMethodFeedback()
        }

    }, false);

    // Recargar la página al cerrar la alerta de éxito.
    document.getElementById("close-alert").addEventListener("click", function () {
        location.reload();
    }, false);

}, false);