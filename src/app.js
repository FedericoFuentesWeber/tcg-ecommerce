import express from "express";
import productRouter from "./routers/products.routers.js";
import cartRouter from "./routers/carts.routers.js";

const app = express();

const initializeApp = () => {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use("/api/products", productRouter);
    app.use("/api/carts", cartRouter);

    app.listen(8080, () => {
        console.log(`Escuchando en el puerto 8080`)
    })
};

initializeApp();