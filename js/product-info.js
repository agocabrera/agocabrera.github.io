// Lista de comentarios del producto actual.
productCommentsArray = [];

// Tomar del objeto los datos del producto actual y mostrarlos en la página.
function showProductInfo(object) {
    document.getElementById("pro-info").innerHTML =
        `<span class="d-inline fw-light">${object.category}</span>
        <span class="float-end fw-light">${object.soldCount} vendidos</span>
        <div class="d-grid gap-2">
            <h1 class="fs-1 mb-0">${object.name}</h1>
            <span class="fw-bold fs-4">${object.currency} ${object.cost}</span>
            <p>${object.description}</p>
        </div>`;
}

// Iterar sobre la lista de imágenes del producto actual para mostrarlas en el carousel.
// Agregar clase "active" al <div> de la primer imagen y al primer <button> para "arrancar" el carousel.
function showProductImages(array) {
    for (let i = 0; i < array.length; i++) {
        const image = array[i];
        document.getElementById("carousel-inner").innerHTML +=
            `<div class="carousel-item">
                <img src="${image}" class="d-block w-100">
            </div>`;

        document.getElementById("carousel-indicators").innerHTML +=
            `<button type="button" data-bs-target="#pro-img-carousel" data-bs-slide-to="${i}" aria-label="Imagen ${i + 1}">
                <img src="${image}" class="d-block w-100 img-fluid">
            </button>`;
    }
    document.getElementById("carousel-inner").getElementsByTagName("div")[0].classList.add("active");
    document.getElementById("carousel-indicators").getElementsByTagName("button")[0].classList.add("active");
}

// Iterar sobre la lista de productos relacionados al producto actual para mostrarlos en la página.
function showProductRelated(array) {
    for (let i = 0; i < array.length; i++) {
        const product = array[i];
        document.getElementById("pro-related").innerHTML +=
            `<div class="card shadow-sm rounded-3" onclick="setId('product', ${product.id})">
                <img src="${product.image}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                </div>
            </div>`;
    }
}

// Iterar sobre la lista de comentarios del producto actual para mostrarlos en la página.
function showProductComments(array) {
    document.getElementById("comments-list").innerHTML = "";
    if (array.length != 0) {
        for (comment of array) {
            document.getElementById("comments-list").innerHTML +=
                `<div class="p-2 shadow-sm rounded-3">
                    <span><strong>${comment.user}</strong> - ${comment.dateTime} - ${showStars(comment.score)}</span>
                    <p class="mb-0">${comment.description}</p>
                </div>`;
        }
    } else {
        document.getElementById("comments-list").innerHTML = "No hay comentarios para mostrar."
    }
}

// Dibujar las estrellas chequeadas y vacías a partir de la calificación del producto en el comentario.
function showStars(number) {
    let maxStars = 5;
    let checkedStars = number;
    let stars = "";

    while (checkedStars > 0) {
        stars += '<span class="fa fa-star checked"></span>';
        checkedStars--;
        maxStars--;
    }

    while (maxStars > 0) {
        stars += '<span class="fa fa-star"></span>';
        maxStars--;
    }

    return stars;
}

// Una vez cargado el documento.
document.addEventListener("DOMContentLoaded", function () {
    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    // Agregar event listener al botón de cerrar sesión.
    document.getElementById("navbar-logout").addEventListener("click", navbarLogout, false);

    // Obtener el objeto con la información del producto actual y
    // llamar a showProductInfo() y showProductImages().
    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("proID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            showProductInfo(resultObj.data);
            showProductImages(resultObj.data.images);
            showProductRelated(resultObj.data.relatedProducts);
        } else {
            document.getElementById("pro-info").innerHTML = "No se ha podido cargar el contenido.";
        }
    });

    // Obtener la lista con los comentarios del producto actual y
    // llamar a showProductComments().
    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("proID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productCommentsArray = resultObj.data;
            showProductComments(productCommentsArray);
        } else {
            document.getElementById("comments-list").innerHTML = "No se han podido cargar los comentarios.";
        }
    });

    // Al hacer click en el botón para enviar un comentario, crear un objeto nuevo para
    // guardar los datos relacionados a ese comentario, agregar ese objeto a la lista
    // de comentarios del producto actual y llamar de nuevo a showProductComments().
    document.getElementById("comment-send").addEventListener("click", function () {
        let newComment = {};

        // Usando '"0" + ' y el método de strings slice() la fecha del comentario nuevo
        // queda con el mismo formato que la de los comentarios ya existentes.
        let date = new Date();
        let year = date.getFullYear();
        let month = ("0" + (date.getMonth() + 1)).slice(-2);
        let day = ("0" + date.getDate()).slice(-2);
        let hour = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);
        let second = ("0" + date.getSeconds()).slice(-2);

        newComment.product = parseInt(localStorage.getItem("proID"));
        newComment.score = parseInt(document.getElementById("comment-score").value);
        newComment.description = document.getElementById("comment-description").value;
        newComment.user = localStorage.getItem("username");
        newComment.dateTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

        productCommentsArray.push(newComment);
        showProductComments(productCommentsArray);

        document.getElementById("comment-description").value = "";
        document.getElementById("comment-score").value = 1;

    }, false);

});