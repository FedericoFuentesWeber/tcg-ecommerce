import { RouterClass } from "./router.js";
import { CartsController } from "../controllers/carts.controller.js";

const {
    createCart,
    getCart,
    addProductToCart,
    deleteProductFromCart,
    deleteCart,
    updateProductFromCart,
    updateCart
} = new CartsController()

class CartsRouter extends RouterClass {
    init() {
        this.get('/:cid', ['USER', 'ADMIN'], getCart)
        this.post('/', ['USER', 'ADMIN'], createCart)
        this.post("/:cid/products/:pid", ['USER', 'ADMIN'], addProductToCart);
        this.delete("/:cid/products/:pid", ['USER', 'ADMIN'], deleteProductFromCart);
        this.delete("/:cid", ['USER', 'ADMIN'], deleteCart);
        this.put("/:cid/products/:pid", ['USER', 'ADMIN'], updateProductFromCart);
        this.put("/:cid", ['USER', 'ADMIN'], updateCart);
    }
}

export { CartsRouter }