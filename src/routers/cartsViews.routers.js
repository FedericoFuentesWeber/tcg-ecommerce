import { Router } from "express";
import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js"; 
import { auth } from "../middleware/authentication.middleware.js";
import { passportCall } from "../middleware/passportCall.middleware.js";

const router = Router();

const cartManager = new CartManagerDB();

router.get("/:cid", passportCall("jwt"), async(req, res) => {
    try {
        const { cid } = req.params;
        const { products } = await cartManager.getCartById(cid);

        res.status(200).render("cart", {
            title: "Carrito",
            session: req.session?.user,
            cartId: cid,
            products: products,
        });
    } catch(error) {
        res.status(400).render("cart", {
            title: "Carrito",
            session: req.session?.user,
            errorMessage: error.message
        });
    }
});

export default router;