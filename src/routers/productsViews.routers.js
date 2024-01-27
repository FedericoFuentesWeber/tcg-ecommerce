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
        return res.status(400).render("index", {
            title: "Productos",
            errorMessage: error.message
        });
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

router.get("/products", async(req, res) => {
    try {
        const {
            limit: queryLimit = 10,
            page: queryPage = 1,
            sort: querySort,
            query
        } = req.query;

        const queryParams = {
            limit: parseInt(queryLimit),
            page: parseInt(queryPage),
            lean: true,
            ...(querySort && { sort: { price: querySort } })
        };

        let querySearch = {};
        if(query) {
            const [field, value] = query.split(":");
            if(field && value) {
                querySearch = { [field]: value };
            }
        }

        const {
            docs,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        } = await productManager.filteredProductsBy(querySearch, queryParams);

        const products = productManager.parseProducts(docs);

        res.status(200).render("products", {
            title: "Productos",
            products: products,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        });
    } catch(error) {
        return res.status(400).render("products", {
            title: "Productos",
            errorMessage: error.message
        });
    }
});

export default router;