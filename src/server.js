import path from "path";
import express from "express";
import { Server } from "socket.io";
import mongoose from "mongoose";
import { engine } from "express-handlebars";
import __dirname from "./dirname.js";
import cartsRouter from "./routes/carts.routes.js";
import viewsRouter from "./routes/views.routes.js";
import productsRouter from "./routes/products.routes.js";
import handlebars from "handlebars";

handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

const app = express();
const PORT = 5000;

mongoose.connect("INGRESAR URL DE CONEXIÓN A MONGODB ATLAS", )
    .then(() => console.log("✅ Conectado a MongoDB Atlas"))
    .catch(err => console.error("❌ Error en la conexión a MongoDB:", err));

const server = app.listen(PORT, () => {
    console.log(`Server running on port http://localhost:${PORT}`);
});

const io = new Server(server);

io.on("connection", (socket) => {
    console.log("🟢 Cliente conectado:", socket.id);
    
    socket.on("disconnect", () => {
        console.log("🔴 Cliente desconectado:", socket.id);
    });
});

app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../public")));

app.engine("hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views", "partials"),
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
}));
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "views"));

app.use("/", viewsRouter);
app.use("/products", productsRouter);
app.use("/api/carts", cartsRouter);