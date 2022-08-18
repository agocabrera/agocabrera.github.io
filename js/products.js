let currentProductsArray = [];

function showProductsList() {
  let htmlContentToAppend = "";
  document.getElementById("pro-list-h2").innerHTML = "Productos";
  document.getElementById("pro-list-desc").innerHTML = `Verás aquí todos los productos de la categoría <strong>${currentProductsArray.catName}</strong>.`;
  
  for (let i = 0; i < currentProductsArray.products.length; i++) {
    let product = currentProductsArray.products[i];
    htmlContentToAppend += `<div class="list-group-item list-group-item-action cursor-active">
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
    document.getElementById("pro-list-container").innerHTML = htmlContentToAppend;
  }
}

// Una vez cargado el documento:

document.addEventListener("DOMContentLoaded", function () {
  getJSONData(PRODUCTS_URL + localStorage.getItem("catID") + EXT_TYPE).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsArray = resultObj.data;
      showProductsList();
    } else {
      document.getElementById("pro-list-container").innerHTML = "No se ha podido cargar el contenido.";
      document.getElementById("pro-list-container").classList.add("alert", "alert-danger", "text-center");
    }
  })
});