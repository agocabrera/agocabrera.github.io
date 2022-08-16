let currentProductsArray = [];
let listContainer = document.getElementById("pro-list-container");

function showProductsList() {
  let htmlContentToAppend = "";
  for (let i = 0; i < currentProductsArray.length; i++) {
    let product = currentProductsArray[i];
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
    listContainer.innerHTML = htmlContentToAppend;
  }
}

// Una vez cargado el documento:

document.addEventListener("DOMContentLoaded", function () {
  getJSONData(PRODUCTS_URL + "101" + EXT_TYPE).then(function (resultObj) {
    if (resultObj.status === "ok") {
      currentProductsArray = resultObj.data.products;
      showProductsList();
    } else {
      listContainer.innerHTML = "No se ha podido cargar el contenido.";
      listContainer.style.marginTop = "100px";
      listContainer.classList.add("alert", "alert-danger", "text-center");
    }
  })
});