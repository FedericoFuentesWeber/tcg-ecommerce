import { RouterClass } from "./router.js";
import { uploader } from "../../utils.js";
import { ProductController } from "../controllers/products.controller.js";

const {
    getProducts,
    getProduct,
    updateProduct,
    deleteProduct,
    createProduct
} = new ProductController();
class ProductRouter extends RouterClass {
    init() {
        this.get('/', ['PUBLIC', 'USER', 'ADMIN'], getProducts);
        this.get('/:pid', ['PUBLIC', 'USER', 'ADMIN'], getProduct);
        this.put('/:pid', ['ADMIN'], updateProduct);
        this.delete('/:pid', ['ADMIN'], deleteProduct);
        this.post('/', ['ADMIN'], uploader.array("thumbnails"), createProduct)
    }
}

export { ProductRouter }