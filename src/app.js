import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import viewRouter from "./routes/view.router.js";
import ProductManager from "./ProductManager.js";

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

const productManager = new ProductManager();

socketServer.on("connection", async (socket) => {
  console.log("Cliente conectado");

  const products = await productManager.getAllProducts();
  socket.emit("productList", products);

  socket.on("addProduct", async (product) => {
    console.log("Producto agregado", product);
    await productManager.addProduct(product);
    const updatedProducts = await productManager.getAllProducts();
    socketServer.emit("productAdded", updatedProducts);
  });

  socket.on("deleteProduct", async (productId) => {
    const deletedProduct = await productManager.deleteProduct(productId);
    if (deletedProduct) {
      socketServer.emit("productDeleted", deletedProduct);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});
