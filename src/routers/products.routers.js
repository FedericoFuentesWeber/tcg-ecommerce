import { Router } from "express";
import { uploader } from "../../utils.js";
import { ProductController } from "../controllers/products.controller.js";

const router = Router();
const {
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createProduct
} = new ProductController();


router.get("/", getProducts);
router.get("/:pid", getProduct);
router.put("/:pid", updateProduct);
router.delete("/:pid", deleteProduct);
router.post("/", uploader.array("thumbnails"), createProduct);

export default router;