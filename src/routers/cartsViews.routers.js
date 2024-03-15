import { Router } from "express";
import { passportCall } from "../middleware/passportCall.middleware.js";
import { CartViewController } from "../controllers/cartsView.controller.js";

const router = Router();

const {
    getCart
} = new CartViewController();

router.get("/:cid", passportCall("jwt"), getCart);

export default router;