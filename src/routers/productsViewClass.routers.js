import { RouterClass } from "./router.js";
import { ProductsViewController } from "../controllers/productsView.controller.js";
import { passportCall } from "../middleware/passportCall.middleware.js";

const {
    getRealTimeProducts,
    getPaginatedProducts
} = new ProductsViewController();
class ProductsViews extends RouterClass {
    init() {
        this.get('/products', passportCall("jwt"), ['PUBLIC', 'USER', 'ADMIN'], getPaginatedProducts);
        this.get('/realtimeproducts', passportCall("jwt"), ['PUBLIC', 'USER', 'ADMIN'], getRealTimeProducts);
    }
}

export { ProductsViews }