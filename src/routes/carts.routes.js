import { Router } from "express";
import FileManager from "../../utils/fileManager.js";
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const cartsFile = new FileManager("./data/carts.json");

router.post("/", async (req, res) => {
  try {
    const newCart = { id: uuidv4(), products: [] };
    const carts = await cartsFile.read();

    carts.push(newCart);
    await cartsFile.write(carts);

    res.status(201).json(newCart);
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ message: "Error al crear el carrito", error: error.message });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await cartsFile.read();
    const cart = carts.find((c) => c.id === cid.toString());

    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).json({ message: "Carrito no encontrado" });
    }
  } catch (error) {
    console.error("Error al obtener el carrito:", error);
    res.status(500).json({ message: "Error al obtener el carrito", error: error.message });
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
    console.error("Error al agregar el producto al carrito:", error);
    res.status(500).json({ message: "Error al agregar el producto al carrito", error: error.message });
  }
});

export default router;
