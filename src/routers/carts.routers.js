import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";
import { authorization } from "../middleware/authorization.middleware.js";

const router = Router();

const {
    createCart,
    getCart,
    addProductToCart,
    deleteProductFromCart,
    deleteCart,
    updateProductFromCart,
    updateCart
} = new CartsController()

router.post("/", createCart);
router.get("/:cid", getCart);
router.post("/:cid/products/:pid", authorization("USER"), addProductToCart);
router.delete("/:cid/products/:pid", deleteProductFromCart);
router.delete("/:cid", deleteCart);
router.put("/:cid/products/:pid", updateProductFromCart);
router.put("/:cid", updateCart);

export default router;