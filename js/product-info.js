function showProductInfo(productObj) {
    document.getElementById("pro-info").innerHTML = `
    <span class="d-inline fw-light">${productObj.category}</span>
    <span class="float-end fw-light">${productObj.soldCount} vendidos</span>
    <div class="d-grid gap-2">
      <h1 class="fs-1 mb-0">${productObj.name}</h1>
      <span class="fw-bold fs-4">${productObj.currency} ${productObj.cost}</span>
      <p>${productObj.description}</p>
    </div>`;
}

function showProductImages(productObj) {
    for ([index, image] of productObj.images.entries()) {
        document.getElementById("carousel-inner").innerHTML += `
        <div class="carousel-item">
          <img src="${image}" class="d-block w-100">
        </div>`;

        document.getElementById("carousel-indicators").innerHTML += `
        <button type="button" data-bs-target="#pro-img-carousel" data-bs-slide-to="${index}" aria-label="Imagen ${index + 1}"></button>`;
    }
    document.getElementById("carousel-inner").getElementsByTagName("div")[0].classList.add("active");
    document.getElementById("carousel-indicators").getElementsByTagName("button")[0].classList.add("active");
}

function getAndShowComments(commentsArray) {
    if (commentsArray.length != 0) {
        for (comment of commentsArray) {
            showComment(comment);
        }
    } else {
        document.getElementById("comments-list").innerHTML = "No hay comentarios para mostrar."
    }
}

function showComment(commentObj) {
    if (document.getElementById("comments-list").getElementsByTagName("div").length == 0) {
        document.getElementById("comments-list").innerHTML = "";
    }
    document.getElementById("comments-list").innerHTML += `
    <div class="p-2 bg-light border border-dark rounded">
      <span><strong>${commentObj.user}</strong> - ${commentObj.dateTime} - ${showStars(commentObj.score)}</span>
      <p class="mb-0">${commentObj.description}</p>
    </div>`;
}

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
        stars += '<span class="fas fa-star"></span>';
        maxStars--;
    }

    return stars;
}

document.addEventListener("DOMContentLoaded", function () {

    // Mostrar nombre de usuario en la barra de navegación.
    navbarShowUsername();

    getJSONData(PRODUCT_INFO_URL + localStorage.getItem("proID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            showProductInfo(resultObj.data);
            showProductImages(resultObj.data);
        } else {
            document.getElementById("pro-info").innerHTML = "No se ha podido cargar el contenido.";
        }
    });

    getJSONData(PRODUCT_INFO_COMMENTS_URL + localStorage.getItem("proID") + EXT_TYPE).then(function (resultObj) {
        if (resultObj.status === "ok") {
            getAndShowComments(resultObj.data);
        } else {
            document.getElementById("comments-list").innerHTML = "No se han podido cargar los comentarios.";
        }
    });

    document.getElementById("comment-send").addEventListener("click", function () {
        let newComment = {};

        let date = new Date();
        let yyyy = date.getFullYear();
        let mm = ("0" + (date.getMonth() + 1)).slice(-2);
        let dd = ("0" + date.getDate()).slice(-2);
        let hour = ("0" + date.getHours()).slice(-2);
        let minute = ("0" + date.getMinutes()).slice(-2);
        let second = ("0" + date.getSeconds()).slice(-2);

        newComment.product = localStorage.getItem("proID");
        newComment.score = document.getElementById("comment-score").value;
        newComment.description = document.getElementById("comment-description").value;
        newComment.user = localStorage.getItem("username");
        newComment.dateTime = `${yyyy}-${mm}-${dd} ${hour}:${minute}:${second}`;

        showComment(newComment);

        document.getElementById("comment-description").value = "";
        document.getElementById("comment-score").value = 1;

    }, false);

});