// Lista del objecto que contiene los productos.
let currentProductsArray = [];

// Al hacer click en un producto (atributo "onclick") del listado, guardar
// el ID del producto en el almacenamiento local y redirigir a "product-info.html".
function setProID(id) {
  localStorage.setItem("proID", id);
  window.location = "product-info.html";
}

// Mostrar en el listado los productos de la lista que recibe como argumento.
function showProductsList(array) {

  let htmlContentToAppend = "";

  if (array.length != 0) {
    for (product of array) {
      htmlContentToAppend +=
        `<div onclick="setProID(${product.id})" class="list-group-item list-group-item-action cursor-active">
          <div class="row">
            <div class="col-3">
              <img src="${product.image}" alt="${product.description}" class="img-thumbnail">
            </div>
            <div class="col">
              <div class="d-flex w-100 justify-content-between">
                <h4 class="mb-1">${product.name} - ${product.currency} ${product.cost}</h4>
                <small class="text-muted">${product.soldCount} vendidos</small>
              </div>
              <p class="mb-1">${product.description}</p>
            </div>
          </div>
        </div>`;
    }
  } else {
    htmlContentToAppend = "No hay productos para mostrar.";
  }
  document.getElementById("pro-list-container").innerHTML = htmlContentToAppend;
}

// Filtrar y ordenar los productos de la lista según
// los criterios establecidos por el usuario.
function filterAndOrderList(array) {

  let filterCostMin = document.getElementById("filterCostMin");
  let filterCostMax = document.getElementById("filterCostMax");
  let search = document.getElementById("search");
  let sortCostDesc = document.getElementById("sortCostDesc");
  let sortCostAsc = document.getElementById("sortCostAsc");
  let sortRelDesc = document.getElementById("sortRelDesc");

  // Si se estableció el costo mínimo del producto en el filtro,
  // quitar productos de la lista por debajo de ese mínimo.
  if (!Number.isNaN(parseInt(filterCostMin.value))) {
    array = array.filter(function (product) {
      return product.cost >= parseInt(filterCostMin.value);
    });
  }

  // Si se estableció el costo máximo del producto en el filtro,
  // quitar productos de la lista por encima de ese máximo.
  if (!Number.isNaN(parseInt(filterCostMax.value))) {
    array = array.filter(function (product) {
      return product.cost <= parseInt(filterCostMax.value);
    });
  }

  // Si el campo de búsqueda no está vacío, quitar productos de la lista
  // que no incluyan el contenido del campo en su nombre o descripción.
  if (search.value.toLowerCase() != "") {
    array = array.filter(function (product) {
      return product.name.toLowerCase().includes(search.value.toLowerCase())
        || product.description.toLowerCase().includes(search.value.toLowerCase());
    });
  }

  // Si el input tipo radio está seleccionado,
  // ordenar lista por costo, de mayor a menor.
  if (sortCostDesc.checked) {
    array.sort(function (a, b) {
      return b.cost - a.cost;
    });
  }

  // Si el input tipo radio está seleccionado,
  // ordenar lista por costo, de menor a mayor.
  if (sortCostAsc.checked) {
    array.sort(function (a, b) {
      return a.cost - b.cost;
    });
  }

  // Si el input tipo radio está seleccionado,
  // ordenar lista por cantidad vendidos, de mayor a menor.
  if (sortRelDesc.checked) {
    array.sort(function (a, b) {
      return b.soldCount - a.soldCount;
    });
  }

  return array;

}

// Quitar los filtros de costo del listado.
function clearFilter() {
  document.getElementById("filterCostMin").value = "";
  document.getElementById("filterCostMax").value = "";
  showProductsList(filterAndOrderList(currentProductsArray));
}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {
  // Mostrar nombre de usuario en la barra de navegación.
  navbarShowUsername();

  // Agregar event listener al botón de cerrar sesión.
  document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

  // Agregar event listeners a los botones del listado.
  document.getElementById("filterCost").addEventListener("click", () => showProductsList(filterAndOrderList(currentProductsArray)), false);
  document.getElementById("sortCostDesc").addEventListener("click", () => showProductsList(filterAndOrderList(currentProductsArray)), false);
  document.getElementById("sortCostAsc").addEventListener("click", () => showProductsList(filterAndOrderList(currentProductsArray)), false);
  document.getElementById("sortRelDesc").addEventListener("click", () => showProductsList(filterAndOrderList(currentProductsArray)), false);
  document.getElementById("search").addEventListener("input", () => showProductsList(filterAndOrderList(currentProductsArray)), false);
  document.getElementById("filterClear").addEventListener("click", clearFilter, false);

  // Solicitar el objeto que contiene la lista de productos.
  // Almacenar la lista en una variable y mostrar el nombre de la categoría en la página.
  getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsArray = resultObj.data.products;
      document.getElementById("pro-list-name").innerHTML = resultObj.data.catName;
      showProductsList(filterAndOrderList(currentProductsArray));
    } else {
      document.getElementById("pro-list-container").innerHTML = "No se ha podido cargar el contenido.";
    }
  });
});