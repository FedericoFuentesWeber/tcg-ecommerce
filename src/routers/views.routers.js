import { Router } from "express";
import { ProductManagerDB } from "../daos/DBManagers/ProductManager/ProductManagerDB.js";

const router = Router();

const productManager = new ProductManagerDB();

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