import { RouterClass } from "./router.js";
import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js";

const cartManager = new CartManagerDB();

class CartsView extends RouterClass {
    init() {
        this.get("/:cid", ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid } = req.params;
                const { products } = await cartManager.getCartById(cid);
        
                res.status(200).render("cart", {
                    title: "Carrito",
                    session: req.session?.user,
                    cartId: cid,
                    products: products,
                });
            } catch(error) {
                res.status(400).render("cart", {
                    title: "Carrito",
                    session: req.session?.user,
                    errorMessage: error.message
                });
            }
        });
    }
}

export { CartsView }