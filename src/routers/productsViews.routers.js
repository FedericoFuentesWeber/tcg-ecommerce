import { Router } from "express";
import { ProductManagerDB } from "../daos/DBManagers/ProductManager/ProductManagerDB.js";
import { auth } from "../middleware/authentication.middleware.js";

const router = Router();

const productManager = new ProductManagerDB();

router.get("/", auth, async(req, res) => {
    try {
        const products = await productManager.getProducts();

        res.status(200).render("index", {
            title: "Productos",
            products: products,
            session: req.session?.user
        });
    } catch(error) {
        return res.status(400).render("index", {
            title: "Productos",
            session: req.session?.user,
            errorMessage: error.message
        });
    }
});

router.get("/realtimeproducts", auth, async(req, res) => {
    try {
        const products = await productManager.getProducts();
        res.status(200).render("realTimeProducts", {
            title: "Productos en tiempo real",
            products: products,
            session: req.session?.user
        });
    } catch(error) {
        return res.status(400).render("index", {
            title: "Productos en tiempo real",
            session: req.session?.user,
            errorMessage: error.message
        });
    }
});

router.get("/products", auth, async(req, res) => {
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
            user: req.session?.user,
            hasPrevPage,
            hasNextPage,
            prevPage,
            nextPage,
            page
        });
    } catch(error) {
        return res.status(400).render("products", {
            title: "Productos",
            user: req.session?.user,
            errorMessage: error.message
        });
    }
});

export default router;