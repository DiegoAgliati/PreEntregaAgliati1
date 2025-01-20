import path from "path";
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./dirname.js";
import viewsRouter from "./routes/views.routes.js"; // Router de vistas
import productsRouter from "./routes/products.routes.js"; // Router de productos

const app = express();
const server = app.listen(5000, () => {
  console.log("Server running on port http://localhost:5000");
});

const io = new Server(server);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

// Configuración de Handlebars
app.engine(
  "hbs",
  engine({
    extname: ".hbs",
    defaultLayout: "main",
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

// Rutas
app.use("/", viewsRouter); // Rutas para vistas
app.use("/api/products", productsRouter(io)); // Rutas para productos

// WebSocket: Configuración básica
const messages = [];

io.on("connection", (socket) => {
  console.log("New Client:", socket.id);

  socket.on("new-product", async (product) => {
    try {
      const products = await productsFile.read();
      product.id = uuidv4(); // Generar ID único
      products.push(product);
      await productsFile.write(products);

      io.emit("product-added", product); // Emitir el nuevo producto a todos los clientes
      console.log("Producto agregado:", product);
    } catch (error) {
      console.error("Error al agregar producto:", error);
    }
  });


  socket.emit("messages", messages);

  // Notificar cuando un nuevo usuario se conecta
  socket.on("new-user", (username) => {
    socket.broadcast.emit("connected", `${username} connected`);
  });
});
