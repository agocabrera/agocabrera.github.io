// Objeto que contiene la información del producto.
let product = {};

// Lista de comentarios del producto.
let productCommentsArray = [];

// Objeto con los datos del usuario que inició sesión.
// Es necesario para enviar comentarios nuevos y para agregar ítems a su carrito.
let activeUser = {};

// Tomar del objeto los datos del producto y mostrarlos en la página.
function showProductInfo(object) {
    document.getElementById("pro-info").innerHTML =
        `<span class="d-inline"><a href="products.html" class="text-decoration-none fw-light text-secondary">← ${object.category}</a></span>
        <span class="float-end fw-light text-secondary">${object.soldCount} vendidos</span>
        <div class="d-grid gap-2">
            <h1 class="fs-1 mb-0">${object.name}</h1>
            <span class="fw-bold fs-4 number-font">${object.cost.toLocaleString("es-UY", { style: "currency", currency: object.currency, minimumFractionDigits: 0 })}</span>
            <p>${object.description}</p>
            <p class="text-danger d-none" id="login-required-message">Inicie sesión para agregar ítems al carrito.</p>
            <p class="text-danger d-none" id="already-added-message">Este ítem ya se encuentra en su carrito.</p>
            <button type="button" class="btn btn-success" id="add-to-cart">Agregar al carrito</button>
        </div>`;

    // Agregar event listener al botón de agregar al carrito.
    document.getElementById("add-to-cart").addEventListener("click", addToCart, false);

    // Desactivar el botón de comprar si el producto ya se encuentra en
    // el carrito o si el usuario no inició sesión.
    if (activeUser === null) {
        document.getElementById("add-to-cart").classList.add("disabled");
        document.getElementById("login-required-message").classList.remove("d-none");
    } else {

        for (let i = 0; i < activeUser.cart.length; i++) {
            if (activeUser.cart[i].id === product.id) {
                document.getElementById("add-to-cart").classList.add("disabled");
                document.getElementById("already-added-message").classList.remove("d-none");
                break;
            }
        }

    }
}

// Agregar el producto al carrito del usuario y guardar en almacenamiento local.
function addToCart() {

    let newCartItem = {
        id: product.id,
        name: product.name,
        count: 1,
        unitCost: product.cost,
        currency: product.currency,
        image: product.images[0]
    }

    activeUser.cart.push(newCartItem);
    localStorage.setItem("user-" + activeUser.email, JSON.stringify(activeUser));
    document.getElementById("add-to-cart").classList.add("disabled");

}

// Iterar sobre la lista de imágenes del producto para mostrarlas en el carrusel.
// Agregar clase "active" al <div> de la primer imagen y al primer <button> para que el carrusel empiece el ciclo.
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
            `<div class="col col-sm-5 col-lg-3 card shadow-sm rounded-3 mb-3 ms-2 me-2" onclick="setId('product', ${product.id})">
                <img src="${product.image}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${product.name}</h5>
                </div>
            </div>`;
    }
}

// Iterar sobre la lista de comentarios del producto para mostrarlos en la página.
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

    // Mostrar controles del usuario en la barra de navegación.
    showUserControls();

    // Obtener los datos del usuario que inició sesión del almacenamiento local.
    activeUser = JSON.parse(localStorage.getItem("user-" + localStorage.getItem("active-user")));

    // Si no hay una sesión activa, deshabilitar los inputs para comentarios nuevos.
    if (activeUser === null) {
        document.getElementById("comment-description").setAttribute("disabled", "");
        document.getElementById("comment-score").setAttribute("disabled", "");
        document.getElementById("comment-send").classList.add("disabled");
        document.getElementById("comment-error").classList.remove("d-none");
    }

    // Solicitar el objeto con la información del producto y llamar a showProductInfo() y showProductImages().
    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("proID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            product = resultObj.data;
            showProductInfo(product);
            showProductImages(product.images);
            showProductRelated(product.relatedProducts);
        } else {
            document.getElementById("pro-info").innerHTML = "No se ha podido cargar el contenido.";
        }
    });

    // Solicitar la lista con los comentarios del producto y llamar a showProductComments().
    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("proID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            productCommentsArray = resultObj.data;
            showProductComments(productCommentsArray);
        } else {
            document.getElementById("comments-list").innerHTML = "No se han podido cargar los comentarios.";
        }
    });

    // Al hacer click en el botón para enviar un nuevo comentario.
    document.getElementById("comment-send").addEventListener("click", function () {

        // Si el comentario está vacío, mostrar error.
        if (document.getElementById("comment-description").value === "") {
            document.getElementById("comment-error").innerHTML = "El comentario no puede estar vacío.";
            document.getElementById("comment-error").classList.remove("d-none");
            return;
        }

        // Usando '"0" + ' y el método de strings slice() la fecha del comentario nuevo
        // queda con el mismo formato que la de los comentarios ya existentes.
        let newDate = new Date();
        let date = {
            year: newDate.getFullYear(),
            month: ("0" + (newDate.getMonth() + 1)).slice(-2),
            day: ("0" + newDate.getDate()).slice(-2),
            hour: ("0" + newDate.getHours()).slice(-2),
            minute: ("0" + newDate.getMinutes()).slice(-2),
            second: ("0" + newDate.getSeconds()).slice(-2)
        }

        // Crear un objeto con todos los datos del comentario nuevo.
        let newComment = {
            product: parseInt(localStorage.getItem("proID")),
            score: parseInt(document.getElementById("comment-score").value),
            description: document.getElementById("comment-description").value,
            user: (activeUser.name !== "" ? activeUser.name : activeUser.email),
            dateTime: `${date.year}-${date.month}-${date.day} ${date.hour}:${date.minute}:${date.second}`
        }

        // Agregar comentario a la lista de comentarios y mostrarla nuevamente.
        productCommentsArray.push(newComment);
        showProductComments(productCommentsArray);

        // Restablecer los campos de descripción y calificación del comentario.
        document.getElementById("comment-description").value = "";
        document.getElementById("comment-score").value = 1;
        document.getElementById("comment-error").classList.add("d-none");

    }, false);

});