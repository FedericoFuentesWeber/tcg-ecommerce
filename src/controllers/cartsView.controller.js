import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js"

class CartViewController {
    constructor() {
        this.cartManager = new CartManagerDB();
    }

    getCart = async(req, res) => {
        try {
            const { cid } = req.params;
            const { products } = await this.cartManager.getCartById(cid);
    
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