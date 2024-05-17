import { Router } from "express";
import { storageDestinationFolder } from "../../utils.js";
import { ProductController } from "../controllers/products.controller.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { passportCall } from "../middleware/passportCall.middleware.js";

const uploader = storageDestinationFolder("products");
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
router.put("/:pid", passportCall("jwt"), authorization("ADMIN"), updateProduct);
router.delete("/:pid", passportCall("jwt"), authorization("ADMIN"), deleteProduct);
router.post("/", uploader.array("thumbnails"), passportCall("jwt"), authorization("ADMIN"), createProduct);

export default router;