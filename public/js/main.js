const socket = io();

socket.on("product-added", (product) => {
    console.log("Producto agregado:", product);
    updateProductList(product);
});

socket.on("product-updated", (product) => {
    console.log("Producto actualizado:", product);
    updateProductList(product);
});

socket.on("product-deleted", (product) => {
    console.log("Producto eliminado:", product);
    removeProductFromList(product.id);
});

function updateProductList(product) {
    const productList = document.getElementById("product-list");
    const li = document.createElement("li");
    li.id = `product-${product.id}`;
    li.textContent = `${product.name} - $${product.price}`;
    productList.appendChild(li);
}

function removeProductFromList(productId) {
    const productElement = document.getElementById(`product-${productId}`);
    if (productElement) {
        productElement.remove();
    }
}
