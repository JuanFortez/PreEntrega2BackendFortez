const socket = io();

function renderProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = ""; // Limpia la lista

  products.forEach((product) => {
    const li = document.createElement("li");
    li.id = product.id; // Asigna el id único
    li.textContent = `${product.name} - ${product.price}`;

    if (document.getElementById("product-form")) {
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Eliminar";
      deleteButton.onclick = () => deleteProduct(product.id);
      li.appendChild(deleteButton);
    }

    productList.appendChild(li);
  });
}

// Escucha eventos del servidor
socket.on("productList", (products) => {
  renderProducts(products);
});

socket.on("productAdded", (products) => {
  renderProducts(products);
});

socket.on("productDeleted", (deletedProduct) => {
  const productElement = document.getElementById(deletedProduct.id);
  if (productElement) {
    productElement.remove();
  }
});

// Manejo del formulario
document
  .getElementById("product-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const productNameElement = document.getElementById("product-name");
    const productPriceElement = document.getElementById("product-price");

    if (!productNameElement || !productPriceElement) {
      alert("Error: No se encontraron los campos del formulario.");
      return;
    }

    const productName = productNameElement.value.trim();
    const productPrice = productPriceElement.value.trim();

    if (!productName || !productPrice) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const productId = Date.now().toString(); // Genera un id único

    // Emite el evento al servidor
    socket.emit("addProduct", {
      name: productName,
      price: productPrice,
      id: productId,
    });

    // Limpia el formulario
    productNameElement.value = "";
    productPriceElement.value = "";
  });

function deleteProduct(productId) {
  socket.emit("deleteProduct", productId, (response) => {
    if (response.error) {
      alert("Error al eliminar el producto: " + response.error);
    } else {
      // Eliminar del DOM
      const productElement = document.getElementById(productId);
      if (productElement) {
        productElement.remove();
      }
    }
  });
}
