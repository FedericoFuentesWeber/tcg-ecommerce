import { Router } from "express";
import { uploader } from "../../utils.js";
import { ProductController } from "../controllers/products.controller.js";
import { authorization } from "../middleware/authorization.middleware.js";

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
router.put("/:pid", authorization("ADMIN"), updateProduct);
router.delete("/:pid", authorization("ADMIN"), deleteProduct);
router.post("/", uploader.array("thumbnails"), authorization("ADMIN"), createProduct);

export default router;