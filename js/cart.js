cartItems = [];

function showCartItems(array) {
    document.getElementById("cart-items").innerHTML = "";
    for (i = 0; i < array.length; i++) {
        let item = array[i];
        document.getElementById("cart-items").innerHTML =
            `<tr>
                <td><img src="${item.image}"></td>
                <td>${item.name}</td>
                <td>${item.currency} <span id="cost-${item.id}">${item.unitCost}</span></td>
                <td>
                    <div class="input-group input-group-sm">
                        <input type="number" class="form-control quantity" id="quantity-${item.id}" min="1" value="${item.count}">
                    </div>
                </td>
                <td><strong>${item.currency} <span id="subtotal-${item.id}">${item.unitCost * item.count}</span></strong></td>
            </tr>`;
    }

    let inputs = document.getElementsByClassName("quantity");
    for (i = 0; i < inputs.length; i++) {
        let input = inputs[i];
        input.addEventListener("input", setNewSubtotal, false);
    }
}

function setNewSubtotal(event) {
    let itemCount = event.target.value;
    let itemId = event.target.id.slice(9);
    let itemCost = document.getElementById("cost-" + itemId).innerHTML;

    document.getElementById("subtotal-" + itemId).innerHTML = itemCost * itemCount;
}

document.addEventListener("DOMContentLoaded", function () {
    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    // Agregar event listener al botón de cerrar sesión.
    document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

    getJSONData(CART_INFO_URL + 25801 + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            cartItems = resultObj.data.articles;
            showCartItems(cartItems);
        } else {
            document.getElementById("cart-items").innerHTML = "No se ha podido cargar el carrito.";
        }
    });

});