import { Router } from "express";
import { passportCall } from "../middleware/passportCall.middleware.js";
import { ProductsViewController } from "../controllers/productsView.controller.js";

const router = Router();
const {
    getProducts,
    getRealTimeProducts,
    getPaginatedProducts
} = new ProductsViewController();

router.get("/", passportCall("jwt"), getProducts);
router.get("/realtimeproducts", passportCall("jwt"), getRealTimeProducts);
router.get("/products", passportCall("jwt"), getPaginatedProducts);

export default router;