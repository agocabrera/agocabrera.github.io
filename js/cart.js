// Lista que contiene los ítems del carrito.
let cartItems = [];

// Mostrar los ítems del carrito en la página.
// Agregar un event listener a cada <input> que tiene la cantidad de ese ítem
// y también a cada <button> que quita ese ítem del carrito.
function showCartItems(array) {
    document.getElementById("cart-items").innerHTML = "";

    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        document.getElementById("cart-items").innerHTML +=
            `<tr id="item-${item.id}">
                <td><img src="${item.image}" onclick="setId('product', ${item.id})"></td>
                <td>${item.name}</td>
                <td>${item.currency} <span class="item-cost">${item.unitCost}</span></td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control item-count" min="1" value="${item.count}">
                    </div>
                </td>
                <td><strong>${item.currency} <span class="item-subtotal">${item.unitCost * item.count}</span></strong></td>
                <td><button type="button" class="item-remove"><span class="fa fa-trash"></span></button></td>
            </tr>`;
    }

    let countClassCollection = document.getElementsByClassName("item-count");
    for (let i = 0; i < countClassCollection.length; i++) {
        let inputElement = countClassCollection[i];
        inputElement.addEventListener("input", setNewSubtotal, false);
    }

    let removeClassCollection = document.getElementsByClassName("item-remove");
    for (let i = 0; i < removeClassCollection.length; i++) {
        let buttonElement = removeClassCollection[i];
        buttonElement.addEventListener("click", removeItemFromCart, false);
    }
}

// Función callback que calcula el nuevo subtotal del item en el carrito.
// "Ir hacia atrás" desde el target del evento (el <input> con la cantidad), hasta encontrarse con 
// el <tr> asociado al ítem, obtener el ID del ítem a partir del <tr>, obtener el precio unitario y 
// la cantidad del ítem buscándolos por sus clases y por último actualizar la lista del carrito con
// la cantidad nueva y el subtotal que muestra la página.
function setNewSubtotal(event) {
    let parentTrElement = event.target.closest("tr");
    let itemToUpdateId = parseInt(parentTrElement.id.replace("item-", ""));
    let itemToUpdateCount = parseInt(parentTrElement.querySelector(".item-count").value);
    let itemToUpdateCost = parseInt(parentTrElement.querySelector(".item-cost").innerHTML);

    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i];
        if (item.id === itemToUpdateId) {
            item.count = itemToUpdateCount;
            localStorage.setItem("cart", JSON.stringify(cartItems));
            showCartItems(cartItems);
            break;
        }
    }

    parentTrElement.querySelector(".item-subtotal").innerHTML = itemToUpdateCost * itemToUpdateCount;
}

// Función callback que quita el ítem del carrito asociado al botón.
// Obtener el ID del ítem de la misma forma que la función anterior y usarlo para encontrar
// el ítem en la lista del carrito, quitarlo y mostrar la lista de nuevo.
function removeItemFromCart(event) {
    let parentTrElement = event.target.closest("tr");
    let itemToRemoveId = parseInt(parentTrElement.id.replace("item-", ""));
    for (let i = 0; i < cartItems.length; i++) {
        let item = cartItems[i];
        if (item.id === itemToRemoveId) {
            cartItems.splice(i, 1);
            localStorage.setItem("cart", JSON.stringify(cartItems));
            showCartItems(cartItems);
            break;
        }
    }
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

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {
    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    // Agregar event listener al botón de cerrar sesión.
    document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

    // Solicitar la lista remota del carrito, concatenarla con la lista local,
    // quitar ítems duplicados si los hay, actualizar la lista local con esta lista nueva
    // y por último mostrarla en la página.
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

});