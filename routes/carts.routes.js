import { Router } from "express";
import FileManager from "../utils/fileManager.js";

const router = Router();
const cartsFile = new FileManager("./data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = { id: Date.now().toString(), products: [] };
    const carts = await cartsFile.read();

    carts.push(newCart);
    await cartsFile.write(carts);

    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ message: "Error al crear el carrito", error });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await cartsFile.read();
    const cart = carts.find((c) => c.id === cid);

    cart ? res.json(cart.products) : res.status(404).json({ message: "Carrito no encontrado" });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el carrito", error });
  }
});

router.post("/:cid/product/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  try {
    const carts = await cartsFile.read();
    const cart = carts.find((c) => c.id === cid);

    if (cart) {
      const existingProduct = cart.products.find((p) => p.product === pid);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }

      await cartsFile.write(carts);
      res.json(cart);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error al agregar el producto al carrito", error });
  }
});

export default router;
