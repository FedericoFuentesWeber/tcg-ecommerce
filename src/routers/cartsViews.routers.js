import { Router } from "express";
import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js"; 

const router = Router();

const cartManager = new CartManagerDB();

router.get("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        const { products } = await cartManager.getCartById(cid);

        res.status(200).render("cart", {
            title: "Carrito",
            cartId: cid,
            products: products,
        });
    } catch(error) {
        res.status(400).render("cart", {
            title: "Carrito",
            errorMessage: error.message
        });
    }
});

export default router;