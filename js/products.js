// Objeto que contiene la lista de productos, ID y nombre de la categoría a la que pertenecen.
let currentProductsObj = {};

// Lista que originalmente se obtuvo del objeto.
// Sirve para restablecer la lista filtrada a su estado original.
let unmodifiedProductsArray = [];

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

// Ordenar lista por precio (mayor a menor).
document.getElementById("sortCostDesc").addEventListener("click", function () {
  currentProductsObj.products.sort(function (a, b) {
    return b.cost - a.cost;
  });
  showProductsList(currentProductsObj);
});

// Ordenar lista por precio (menor a mayor).
document.getElementById("sortCostAsc").addEventListener("click", function () {
  currentProductsObj.products.sort(function (a, b) {
    return a.cost - b.cost;
  });
  showProductsList(currentProductsObj);
});

// Ordenar lista por cantidad vendidos (mayor a menor).
document.getElementById("sortRelDesc").addEventListener("click", function () {
  currentProductsObj.products.sort(function (a, b) {
    return b.soldCount - a.soldCount;
  });
  showProductsList(currentProductsObj);
});

// Función que verifica si el costo del producto está dentro del mínimo y máximo del filtro.
// Devuelve falso o verdadero para que el método filter() decida si remover el producto de la lista o no.
function insideFilterRange(product) {
  let min = parseInt(document.getElementById("filterCostMin").value);
  let max = parseInt(document.getElementById("filterCostMax").value);
  let cost = product.cost;
  return cost >= min && cost <= max;
}

// Filtrar lista según precio mínimo y máximo.
document.getElementById("filterCost").addEventListener("click", function () {
  currentProductsObj.products = unmodifiedProductsArray;
  currentProductsObj.products = currentProductsObj.products.filter(insideFilterRange);
  showProductsList(currentProductsObj);
});

// Dejar de filtrar la lista.
document.getElementById("filterClear").addEventListener("click", function () {
  document.getElementById("filterCostMin").value = "";
  document.getElementById("filterCostMax").value = "";
  currentProductsObj.products = unmodifiedProductsArray;
  showProductsList(currentProductsObj);
});

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {
  // Mostrar nombre de usuario en la barra de navegación.
  navbarShowUsername();

  // Solicitar el objeto que contiene la lista de productos.
  getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsObj = resultObj.data;
      unmodifiedProductsArray = resultObj.data.products;
      showProductsList(currentProductsObj);
    } else {
      document.getElementById("pro-list-container").innerHTML = "No se ha podido cargar el contenido.";
    }
  })
});