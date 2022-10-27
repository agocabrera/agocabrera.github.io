// Lista que contiene los ítems del carrito.
let cartItems = [];

// Booleano que cambia cuando la página pasa por el
// proceso de validación por primera vez.
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
    let shippingFee = 0;

    if (shippingMethod !== null) {

        if (shippingMethod.value === "3") {
            shippingFee = 0.15;
        } else if (shippingMethod.value === "2") {
            shippingFee = 0.07;
        } else if (shippingMethod.value === "1") {
            shippingFee = 0.05;
        }

    } else {
        return 0;
    }

    return subtotal * shippingFee;

}

// Actualizar el subtotal, costo de envío y total en la página.
function updateTotal() {
    let subtotal = calcSubtotalCost(cartItems);
    let shippingCost = calcShippingCost(subtotal);
    let total = subtotal + shippingCost;

    if (subtotal !== 0 && shippingCost !== 0) {
        document.getElementById("subtotal-cost").innerHTML = subtotal.toLocaleString("es-UY", { style: "currency", currency: "USD" });
        document.getElementById("shipping-cost").innerHTML = shippingCost.toLocaleString("es-UY", { style: "currency", currency: "USD" });
        document.getElementById("total-cost").innerHTML = total.toLocaleString("es-UY", { style: "currency", currency: "USD" });
    }

}

// Mostrar los ítems del carrito en la página.
// Agregar un event listener a cada <input> que tiene la cantidad de ese ítem
// y también a cada <button> que quita ese ítem del carrito.
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

    updateTotal();

}

// Función callback que actualiza la cantidad del ítem en el carrito.
// Obtiene el ID del ítem a partir del dataset del target del evento, usa ese
// ID para encontrar el ítem en la lista del carrito y actualiza su cantidad
// siempre y cuando sea un número válido.
function updateCount(event) {
    let itemToUpdateId = parseInt(event.target.dataset.productId);
    let itemToUpdate = cartItems.find((item) => { return item.id === itemToUpdateId });
    let newCount = parseInt(event.target.value);

    if (!(Number.isNaN(newCount) || newCount < 1)) {
        itemToUpdate.count = newCount;
        localStorage.setItem("cart", JSON.stringify(cartItems));
        showCartItems(cartItems);
    } else {
        event.target.value = itemToUpdate.count;
    }

}

// Función callback que quita el ítem del carrito asociado al botón.
// Obtiene el ID del ítem a partir del dataset del target del evento, usa ese 
// ID para encontrar el ítem en la lista del carrito y quitarlo.
function removeItemFromCart(event) {
    let itemToRemoveId = parseInt(event.target.dataset.productId);
    let itemToRemoveIndex = cartItems.findIndex((item) => { return item.id === itemToRemoveId });

    cartItems.splice(itemToRemoveIndex, 1);
    localStorage.setItem("cart", JSON.stringify(cartItems));
    showCartItems(cartItems);
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

// Deshabilitar los inputs de la forma de pago que no está seleccionada, dar
// feedback si el formulario no fue válido al intentar enviarse la primera vez
// y devolver verdadero o falso según la validez de la información de pago.
// Puede que haya que modularizar esta función un poco más.
function validatePaymentInfo() {
    console.log("validatePaymentInfo")
    let paymentMethodInput = document.querySelector("input[name=payment-method-input]:checked");
    let paymentMethodDisplay = document.getElementById("payment-method-display");
    let cardForm = document.getElementById("card-form");
    let bankForm = document.getElementById("bank-form");
    let enabledForm;
    let disabledForm;

    if (paymentMethodInput === null) {
        paymentMethodDisplay.classList.add("text-danger");
        return false;
    } else if (paymentMethodInput.value === "1") {
        disabledForm = bankForm;
        enabledForm = cardForm;
    } else if (paymentMethodInput.value === "2") {
        disabledForm = cardForm;
        enabledForm = bankForm;
    }

    for (input of disabledForm.querySelectorAll("input")) {
        input.setAttribute("disabled", "");
        input.removeEventListener("input", validatePaymentInfo, false);
    }

    for (input of enabledForm.querySelectorAll("input")) {
        input.removeAttribute("disabled");
        input.addEventListener("input", validatePaymentInfo, false);
    }

    if (inputsVerified) {
        disabledForm.classList.remove("was-validated");
        enabledForm.classList.add("was-validated");

        if (enabledForm.checkValidity()) {
            paymentMethodDisplay.classList.remove("text-danger");
            paymentMethodDisplay.classList.add("text-success");
        } else {
            paymentMethodDisplay.classList.remove("text-success");
            paymentMethodDisplay.classList.add("text-danger");
        }

    }

    return enabledForm.checkValidity();

}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {

    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    // Agregar event listener al botón de cerrar sesión.
    document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

    // Solicitar la lista remota del carrito, concatenarla con la lista local, quitar ítems duplicados
    // si los hay, actualizar la lista local con esta lista nueva y por último mostrarla en la página.
    getJSONData(CART_INFO_URL + 25801 + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {

            let remoteCartItems = resultObj.data.articles;
            let localCartItems = [];

            if (localStorage.getItem("cart") != null) {
                localCartItems = JSON.parse(localStorage.getItem("cart"));
            }

            cartItems = localCartItems.concat(remoteCartItems);
            cartItems = removeCartDuplicates(cartItems);
            localStorage.setItem("cart", JSON.stringify(cartItems));

            showCartItems(cartItems);

        } else {
            document.getElementById("cart-items").innerHTML = "No se ha podido cargar el carrito.";
        }
    });

    // Actualizar costo de envío al cambiar tipo de envío.
    document.getElementById("shipping-premium").addEventListener("change", updateTotal, false);
    document.getElementById("shipping-express").addEventListener("change", updateTotal, false);
    document.getElementById("shipping-standard").addEventListener("change", updateTotal, false);

    // Al seleccionar una forma de pago, llamar a la función pertinente.
    document.getElementById("payment-card").addEventListener("change", validatePaymentInfo, false);
    document.getElementById("payment-bank").addEventListener("change", validatePaymentInfo, false);

    // Cuando el formulario de dirección de envío se intenta enviar, hacer lo que sigue...
    document.getElementById("address-form").addEventListener("submit", function (event) {

        let inputsAreValid = true;

        event.preventDefault();
        event.stopPropagation();

        // Verificar la validez de los inputs de cantidad del carrito.
        for (element of document.getElementsByClassName("item-count")) {
            if (!element.checkValidity()) {
                inputsAreValid = false;
                break;
            }
        }

        // Verificar que se hayan ingresado todos los datos de la dirección de envío.
        if (!(document.getElementById("shipping-main-street").checkValidity() &&
            document.getElementById("shipping-door-number").checkValidity() &&
            document.getElementById("shipping-corner-street").checkValidity())) {

            inputsAreValid = false;
        }

        // Verificar que un tipo de envío haya sido seleccionado.
        // Alcanza con verificar sólo uno de los input tipo radio.
        if (!document.querySelector("input[name=shipping-method]").checkValidity()) {
            inputsAreValid = false;
        }

        inputsVerified = true;

        // Si al menos un input no es válido, agregar la clase de Bootstrap "was-validated" a
        // los elementos que contengan los inputs evaluados, sino mostrar la alerta de éxito.
        if (validatePaymentInfo() && inputsAreValid) {
            document.getElementById("purchase-success").classList.remove("d-none");
        } else {
            document.getElementById("cart-items").classList.add("was-validated");
            document.getElementById("address-form").classList.add("was-validated");
            document.getElementById("shipping-method").classList.add("was-validated");
        }

    }, false);

    // Recargar la página al cerrar la alerta de éxito.
    document.getElementById("close-alert").addEventListener("click", function () {
        location.reload();
    }, false);

}, false);