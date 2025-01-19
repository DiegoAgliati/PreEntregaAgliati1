import { Router } from "express";
import FileManager from "../utils/fileManager.js"; 
import path from "path";

const router = Router();
const productsFile = new FileManager(path.resolve("./data/products.json")); 

router.get("/", async (req, res) => {
  try {
    const products = await productsFile.read();
    res.render("home", { 
      title: "Lista de Productos", 
      products
    });
  } catch (error) {
    res.status(500).json({ message: "Error al cargar la página", error });
  }
});

router.get("/realtimeproducts", (req, res) => {
  res.render("realTimeProducts", { title: "Productos en Tiempo Real" });
});

export default router;
