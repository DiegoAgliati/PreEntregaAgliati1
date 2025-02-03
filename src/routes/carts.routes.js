import { Router } from "express";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const newCart = new Cart({ products: [] });
    await newCart.save();
    res.status(201).json({ message: "Carrito creado", cart: newCart });
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.cid).populate("products.product");
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    
    const totalPrice = cart.products.reduce((total, item) => {
      return total + (Number(item.product.price) * Number(item.quantity));
    }, 0);
    
    res.render("carts", { products: cart.products, cartId: cart._id, totalPrice: totalPrice.toFixed(2) });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");
    
    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }
    
    const productExists = await Product.findOne({ _id: pid });
    if (!productExists) {
      return res.status(400).json({ message: "Producto no encontrado" });
    }

    const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid);
    if (productIndex !== -1) {
      cart.products[productIndex].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    res.status(200).json({ message: "Producto agregado al carrito", cart });
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el producto", error });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await Cart.findById(cid).populate("products.product");

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    const productIndex = cart.products.findIndex(p => p.product._id.toString() === pid);
    if (productIndex !== -1) {
      if (cart.products[productIndex].quantity > 1) {
        cart.products[productIndex].quantity -= 1;
      } else {
        cart.products.splice(productIndex, 1);
      }
      await cart.save();
      return res.status(200).json({ message: "Cantidad reducida o producto eliminado", cart });
    }

    res.status(404).json({ message: "Producto no encontrado en el carrito" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar el producto", error });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await Cart.findById(cid);

    if (!cart) {
      return res.status(404).json({ message: "Carrito no encontrado" });
    }

    cart.products = [];
    await cart.save();
    res.status(200).json({ message: "Carrito vaciado correctamente", cart });
  } catch (error) {
    res.status(500).json({ message: "Error al vaciar el carrito", error });
  }
});

export default router;
