let cartItems = [];

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

document.addEventListener("DOMContentLoaded", function () {
    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    // Agregar event listener al botón de cerrar sesión.
    document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

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