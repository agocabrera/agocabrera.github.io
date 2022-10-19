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
            `<tr>
                <td><img src="${item.image}" onclick="setId('product', ${item.id})"></td>
                <td>${item.name}</td>
                <td>${item.currency} ${item.unitCost}</td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control item-count" data-product-id="${item.id}" min="1" value="${item.count}">
                    </div>
                </td>
                <td><strong>${item.currency} ${item.unitCost * item.count}</strong></td>
                <td><button type="button" class="item-remove" data-product-id="${item.id}"><span class="fa fa-trash"></span></button></td>
            </tr>`;
    }

    let countClassCollection = document.getElementsByClassName("item-count");
    for (let i = 0; i < countClassCollection.length; i++) {
        let inputElement = countClassCollection[i];
        inputElement.addEventListener("input", setNewCount, false);
    }

    let removeClassCollection = document.getElementsByClassName("item-remove");
    for (let i = 0; i < removeClassCollection.length; i++) {
        let buttonElement = removeClassCollection[i];
        buttonElement.addEventListener("click", removeItemFromCart, false);
    }
}

// Función callback que actualiza la cantidad del ítem en el carrito.
// Obtiene el ID del ítem a partir del dataset del target del evento, usa ese
// ID para encontrar el ítem en la lista del carrito y actualiza su cantidad.
function setNewCount(event) {
    let itemToUpdateId = parseInt(event.target.dataset.productId);
    let itemToUpdate = cartItems.find((item) => { return item.id === itemToUpdateId });
    let itemToUpdateNewCount = parseInt(event.target.value);

    itemToUpdate.count = itemToUpdateNewCount;
    localStorage.setItem("cart", JSON.stringify(cartItems));
    showCartItems(cartItems);
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