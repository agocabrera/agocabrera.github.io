remoteCartItemsArray = [];
localCartItemsArray = [];

function showCartItems(array, clearContainer) {
    if (clearContainer) {
        document.getElementById("cart-items").innerHTML = "";
    }
    
    for (let i = 0; i < array.length; i++) {
        let item = array[i];
        document.getElementById("cart-items").innerHTML +=
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
                <td><button type="button" class="remove" id="remove-${item.id}"><span class="fa fa-trash"></span></button></td>
            </tr>`;
    }

    let quantityClassCollection = document.getElementsByClassName("quantity");
    for (let i = 0; i < quantityClassCollection.length; i++) {
        let inputElement = quantityClassCollection[i];
        inputElement.addEventListener("input", setNewSubtotal, false);
    }

    let removeClassCollection = document.getElementsByClassName("remove");
    for (let i = 0; i < removeClassCollection.length; i++) {
        let buttonElement = removeClassCollection[i];
        buttonElement.addEventListener("click", removeItemFromCart, false);
    }

}

function setNewSubtotal(event) {
    console.log(event);
    let itemCount = event.target.value;
    let itemId = event.target.id.replace("quantity-", "");
    let itemCost = document.getElementById("cost-" + itemId).innerHTML;

    document.getElementById("subtotal-" + itemId).innerHTML = itemCost * itemCount;
}

function removeItemFromCart(event) {
    let itemToRemoveId = parseInt(event.target.id.replace("remove-", ""));
    for (let i = 0; i < localCartItemsArray.length; i++) {
        let cartItem = localCartItemsArray[i];
        if (cartItem.id === itemToRemoveId) {
            localCartItemsArray.splice(i, 1);
            localStorage.setItem("cartItemList", JSON.stringify(localCartItemsArray));
            showCartItems(remoteCartItemsArray, true);
            showCartItems(localCartItemsArray, false);
            break;
        }
    }
}

function getCartList(key) {
    let cartItemList = JSON.parse(localStorage.getItem(key));
    if (cartItemList != null) {
        for (let i = 0; i < cartItemList.length; i++) {
            let item = cartItemList[i];
            localCartItemsArray.push(item);
        }
    }
}

document.addEventListener("DOMContentLoaded", function () {
    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    // Agregar event listener al botón de cerrar sesión.
    document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

    getJSONData(CART_INFO_URL + 25801 + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            remoteCartItemsArray = resultObj.data.articles;
            showCartItems(remoteCartItemsArray, true);
            getCartList("cartItemList");
            showCartItems(localCartItemsArray, false);
        } else {
            document.getElementById("cart-items").innerHTML = "No se ha podido cargar el carrito.";
        }
    });

});