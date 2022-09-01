// Objeto que contiene la lista de productos, ID y nombre de la categoría a la que pertenecen.
let currentProductsObj = {};

// Lista sin modificar que se obtuvo del objeto.
// Sirve para restablecer la lista filtrada a su estado original.
let originalProductsArray = [];

// Mostrar en el listado los productos de la lista contenida en el objeto.
function showProductsList(obj) {

  let htmlContentToAppend = "";
  document.getElementById("pro-list-name").innerHTML = obj.catName;

  if (obj.products.length != 0) {
    for (product of obj.products) {
      htmlContentToAppend +=
        `<div class="list-group-item list-group-item-action cursor-active">
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

function filterAndOrderList(obj) {
  obj.products = originalProductsArray;
  let productList = obj.products;
  let filterCostMin = document.getElementById("filterCostMin");
  let filterCostMax = document.getElementById("filterCostMax");
  let search = document.getElementById("search");
  let sortCostDesc = document.getElementById("sortCostDesc");
  let sortCostAsc = document.getElementById("sortCostAsc");
  let sortRelDesc = document.getElementById("sortRelDesc");

  // Si se estableció el costo mínimo del producto en el filtro,
  // quitar productos de la lista por debajo de ese mínimo.
  if (!Number.isNaN(parseInt(filterCostMin.value))) {
    productList = productList.filter(function (product) {
      return product.cost >= parseInt(filterCostMin.value);
    });
  }

  // Si se estableció el costo máximo del producto en el filtro,
  // quitar productos de la lista por encima de ese máximo.
  if (!Number.isNaN(parseInt(filterCostMax.value))) {
    productList = productList.filter(function (product) {
      return product.cost <= parseInt(filterCostMax.value);
    });
  }

  // Si el campo de búsqueda no está vacío, quitar productos de la lista
  // que no incluyan el contenido del campo en su nombre o descripción.
  if (search.value.toLowerCase() != "") {
    productList = productList.filter(function (product) {
      return product.name.toLowerCase().includes(search.value.toLowerCase())
        || product.description.toLowerCase().includes(search.value.toLowerCase());
    });
  }

  // Si el input tipo radio está seleccionado,
  // ordenar lista por costo, de mayor a menor.
  if (sortCostDesc.checked) {
    productList.sort(function (a, b) {
      return b.cost - a.cost;
    });
  }

  // Si el input tipo radio está seleccionado,
  // ordenar lista por costo, de menor a mayor.
  if (sortCostAsc.checked) {
    productList.sort(function (a, b) {
      return a.cost - b.cost;
    });
  }

  // Si el input tipo radio está seleccionado,
  // ordenar lista por cantidad vendidos, de mayor a menor.
  if (sortRelDesc.checked) {
    productList.sort(function (a, b) {
      return b.soldCount - a.soldCount;
    });
  }

  obj.products = productList;
  return obj;

}

// Combinar filterAndOrderList() y showProductsList().
function filterOrderAndShow() {
  showProductsList(filterAndOrderList(currentProductsObj));
}

// Quitar los filtros de costo del listado.
function clearFilter() {
  document.getElementById("filterCostMin").value = "";
  document.getElementById("filterCostMax").value = "";
  filterOrderAndShow();
}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {

  // Mostrar nombre de usuario en la barra de navegación.
  navbarShowUsername();

  // Solicitar el objeto que contiene la lista de productos.
  getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsObj = resultObj.data;
      originalProductsArray = resultObj.data.products;
      showProductsList(currentProductsObj);
    } else {
      document.getElementById("pro-list-container").innerHTML = "No se ha podido cargar el contenido.";
    }
  })

  // Agregar event listeners a los botones del listado.
  document.getElementById("filterCost").addEventListener("click", filterOrderAndShow);
  document.getElementById("sortCostDesc").addEventListener("click", filterOrderAndShow);
  document.getElementById("sortCostAsc").addEventListener("click", filterOrderAndShow);
  document.getElementById("sortRelDesc").addEventListener("click", filterOrderAndShow);
  document.getElementById("search").addEventListener("input", filterOrderAndShow);
  document.getElementById("filterClear").addEventListener("click", clearFilter);

});