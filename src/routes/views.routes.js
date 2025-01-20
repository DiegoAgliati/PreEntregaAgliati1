import { Router } from "express";
import FileManager from "../utils/fileManager.js"; // Asegúrate de que la ruta sea correcta
import path from "path";

const router = Router();
const productsFile = new FileManager(path.resolve("./data/products.json")); // Ruta al archivo de productos

// Ruta para renderizar "home.hbs" con los productos
router.get("/", async (req, res) => {
  try {
    const products = await productsFile.read(); // Leer productos desde el archivo
    res.render("home", { 
      title: "Lista de Productos", 
      products // Pasar productos a la vista
    });
  } catch (error) {
    res.status(500).json({ message: "Error al cargar la página", error });
  }
});

// Ruta para "realTimeProducts.hbs"
router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

export default router;
