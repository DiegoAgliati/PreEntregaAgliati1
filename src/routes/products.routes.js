import { Router } from "express";
import FileManager from "../utils/fileManager.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

export default function productsRouter(io) {
  const router = Router();
  const productsFile = new FileManager(path.resolve("./data/products.json")); 

 
  router.get("/", async (req, res) => {
    try {
      const products = await productsFile.read();
      res.json(products || []);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los productos", error });
    }
  });

  
  router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
      const products = await productsFile.read();
      const product = products.find((p) => p.id === pid);
      product ? res.json(product) : res.status(404).json({ message: "Producto no encontrado" });
    } catch (error) {
      res.status(500).json({ message: "Error al obtener el producto", error });
    }
  });

  
  router.post("/", async (req, res) => {
    try {
      console.log("Solicitud POST recibida:", req.body);
      const product = req.body;
      const products = await productsFile.read();

      product.id = uuidv4(); 
      product.status = true;
      products.push(product);

      await productsFile.write(products);

      
      io.emit("product-added", product);

      res.status(201).json(product);
    } catch (error) {
      res.status(500).json({ message: "Error al crear el producto", error });
    }
  });

 
  router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    const updateData = req.body;
    try {
      const products = await productsFile.read();
      const index = products.findIndex((p) => p.id === pid);

      if (index !== -1) {
        products[index] = { ...products[index], ...updateData, id: products[index].id };
        await productsFile.write(products);

       
        io.emit("product-updated", products[index]);

        res.json(products[index]);
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el producto", error });
    }
  });


  router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
      let products = await productsFile.read();
      const productExists = products.some((p) => p.id === pid);

      if (productExists) {
        const deletedProduct = products.find((p) => p.id === pid);
        products = products.filter((p) => p.id !== pid);
        await productsFile.write(products);

      
        io.emit("product-deleted", deletedProduct);

        res.json({ message: "Producto eliminado" });
      } else {
        res.status(404).json({ message: "Producto no encontrado" });
      }
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el producto", error });
    }
  });

  return router
}
