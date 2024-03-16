import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js"
import { cartService } from "../repositories/index.js";

class CartViewController {
    constructor() {
        this.cartManager = new CartManagerDB();
        this.service = cartService;
    }

    getCart = async(req, res) => {
        try {
            const { cid } = req.params;
            const { products } = await this.service.getCart(cid);
    
            res.status(200).render("cart", {
                title: "Carrito",
                session: req.user,
                cartId: cid,
                products: products,
            });
        } catch(error) {
            res.status(400).render("cart", {
                title: "Carrito",
                session: req.user,
                errorMessage: error.message
            });
        }
    };
}

export { CartViewController }