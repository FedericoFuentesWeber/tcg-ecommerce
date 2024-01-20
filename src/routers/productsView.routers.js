import { Router } from "express";
import { ProductManager } from "../daos/FileBasedManagers/ProductManager/ProductManager.js";

const router = Router();
const filePath = "./resources/Products.json";

const productManager = new ProductManager(filePath);

router.get("/", async(req, res) => {
    try {
        const products = await productManager.getProducts();

        res.status(200).render("index", {
            title: "Productos",
            products: products
        });
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.get("/realtimeproducts", async(req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).render("realTimeProducts", {
            title: "Productos en tiempo real",
            products: products
        });
    } catch(error) {
        return res.status(400).render("index", {
            title: "Productos en tiempo real",
            errorMessage: error.message
        });
    }
});

export default router;