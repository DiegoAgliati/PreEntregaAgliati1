import path from "path";
import express from "express";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { __dirname } from "./dirname.js";
import viewsRouter from "./routes/views.routes.js"; 
import productsRouter from "./routes/products.routes.js"; 

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
app.use("/", viewsRouter); 
app.use("/api/products", productsRouter(io)); 

// WebSocket: Configuración básica
const messages = [];

io.on("connection", (socket) => {
  console.log("New Client:", socket.id);

  // Lógica para mensajes en tiempo real
  socket.on("new-message", (data) => {
    messages.push(data);
    io.emit("messages", messages);
  });

  socket.emit("messages", messages);

  // Notificar cuando un nuevo usuario se conecta
  socket.on("new-user", (username) => {
    socket.broadcast.emit("connected", `${username} connected`);
  });
});
