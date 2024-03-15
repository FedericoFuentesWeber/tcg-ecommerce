import { RouterClass } from "./router.js";
import { CartViewController } from "../controllers/cartsView.controller.js";
import { passportCall } from "../middleware/passportCall.middleware.js";

const {
    getCart
} = new CartViewController();

class CartsView extends RouterClass {
    init() {
        this.get("/:cid", passportCall("jwt"), ['USER', 'ADMIN'], getCart);
    }
}

export { CartsView }