const CATEGORIES_URL = "https://japceibal.github.io/emercado-api/cats/cat.json";
const PUBLISH_PRODUCT_URL = "https://japceibal.github.io/emercado-api/sell/publish.json";
const PRODUCTS_URL = "https://japceibal.github.io/emercado-api/cats_products/";
const PRODUCT_INFO_URL = "https://japceibal.github.io/emercado-api/products/";
const PRODUCT_INFO_COMMENTS_URL = "https://japceibal.github.io/emercado-api/products_comments/";
const CART_INFO_URL = "https://japceibal.github.io/emercado-api/user_cart/";
const CART_BUY_URL = "https://japceibal.github.io/emercado-api/cart/buy.json";
const EXT_TYPE = ".json";

let showSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "block";
}

let hideSpinner = function () {
  document.getElementById("spinner-wrapper").style.display = "none";
}

let getJSONData = function (url) {
  let result = {};
  showSpinner();
  return fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw Error(response.statusText);
      }
    })
    .then(function (response) {
      result.status = 'ok';
      result.data = response;
      hideSpinner();
      return result;
    })
    .catch(function (error) {
      result.status = 'error';
      result.data = error;
      hideSpinner();
      return result;
    });
}

// Al hacer click en un producto o categoría (atributo "onclick") del listado, guardar
// el ID del producto o categoría en el almacenamiento local y redirigir a donde corresponda.
let setId = function (type, id) {

  if (type === "product") {
    localStorage.setItem("proID", id);
    window.location = "product-info.html";
  }

  if (type === "category") {
    localStorage.setItem("catID", id);
    window.location = "products.html";
  }

}

let logoutUser = function () {
  localStorage.removeItem("active-user");
  window.location.href = "index.html";
}

let showUserControls = function () {
  // Si el usuario inició sesión...
  if (localStorage.getItem("active-user") !== null) {
    // Traer sus datos del almacenamiento local.
    let activeUser = JSON.parse(localStorage.getItem("user-" + localStorage.getItem("active-user")));
    let userName;

    // Si ingresó su nombre mostrarlo, sino mostrar email.
    if (activeUser.name !== "") {

      userName = activeUser.name;

    } else {

      userName = activeUser.email;

    }

    // Mostrar controles del usuario.
    document.getElementById("navbar-user").classList.add("dropdown");
    document.getElementById("navbar-user").innerHTML = `
      <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
        ${userName}
      </a>
      <ul class="dropdown-menu dropdown-menu-dark">
        <li><a class="dropdown-item" href="cart.html">Mi carrito</a></li>
        <li><a class="dropdown-item" href="my-profile.html">Mi perfil</a></li>
        <li><a class="dropdown-item" href="#" id="navbar-logout">Cerrar sesión</a></li>
      </ul>`;

    document.getElementById("navbar-logout").addEventListener("click", logoutUser, false);

  } else {

    // Si el usuario no inició sesión...
    document.getElementById("navbar-user").innerHTML = `<a class="nav-link" href="index.html" role="button">Iniciar sesión</a>`;

  }

}