import { Router } from "express";
import { CartsController } from "../controllers/carts.controller.js";

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
router.post("/:cid/products/:pid", addProductToCart);
router.delete("/:cid/products/:pid", deleteProductFromCart);
router.delete("/:cid", deleteCart);
router.put("/:cid/products/:pid", updateProductFromCart);
router.put("/:cid", updateCart);

export default router;