import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewRouter from "./routes/view.router.js";

const app = express();
const PORT = process.env.PORT || 9090;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.engine("handlebars", handlebars.engine());
app.set("view engine", "handlebars");
app.set("views", "./src/views");

app.use(express.static(__dirname + "/public"));

app.use("/", viewRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Server corriendo en http://localhost:${PORT}`);
});

const socketServer = new Server(httpServer);

const products = [];
socketServer.on("connection", (socket) => {
  console.log("Cliente conectado");

  socket.emit("productList", products);

  socket.on("addProduct", (product) => {
    console.log("Producto agregado", product);
    //TODO: Agregar producto a la lista de productos por medio de la clase ProductManager
    //TODO: ProductManager.getAllProducts
    products.push(product);
    socketServer.emit("productAdded", products);
  });

  socket.on("deleteProduct", (productId) => {
    const index = products.findIndex((p) => p.id === productId);
    if (index !== -1) {
      const [deletedProduct] = products.splice(index, 1);
      socketServer.emit("productDeleted", deletedProduct);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
