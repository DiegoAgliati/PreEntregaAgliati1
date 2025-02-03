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
    removeProductFromList(product._id);
});

const searchInput = document.getElementById("search-input");
const productContainer = document.getElementById("products-container");

searchInput.addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const products = document.querySelectorAll(".card");
    
    products.forEach(product => {
        const title = product.getAttribute("data-title").toLowerCase();
        if (title.includes(query)) {
            product.style.display = "flex";
        } else {
            product.style.display = "none";
        }
    });
});

async function addToCart(productId) {
    console.log("Intentando agregar producto con ID:", productId);
    let cartId = localStorage.getItem("cartId");
    if (!cartId) {
        try {
            console.log("No hay cartId en localStorage. Creando un nuevo carrito...");
            const response = await fetch("/api/carts", { method: "POST" });
            const data = await response.json();
            cartId = data.cart._id;
            localStorage.setItem("cartId", cartId);
            console.log("Nuevo cartId generado:", cartId);
        } catch (error) {
            console.error("Error al crear el carrito", error);
            return;
        }
    }
    console.log("Usando cartId:", cartId);
    sendAddToCartRequest(cartId, productId);
}

async function sendAddToCartRequest(cartId, productId) {
    try {
        console.log(`Enviando solicitud a /api/carts/${cartId}/products/${productId}`);
        const response = await fetch(`/api/carts/${cartId}/products/${productId}`, { method: "POST" });
        const data = await response.json();
        console.log("Respuesta del backend:", data);
        if (data.message === "Producto agregado al carrito") {
            alert("Producto agregado al carrito");
        } else {
            alert("Error al agregar producto");
        }
    } catch (error) {
        console.error("Error al agregar producto", error);
    }
}