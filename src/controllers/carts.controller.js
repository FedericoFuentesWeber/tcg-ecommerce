import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js";

class CartsController {
    constructor() {
        this.cartManager = new CartManagerDB();
    }

    createCart = async (req, res) => {
        try {
            const products = req.body;
    
            const { _id: id } = await this.cartManager.addCart(products);
    
            return res.status(201).send({ 
                status: "success", 
                description: "El carrito fue agregado correctamente.",
                cartId: id.toString()
            });
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message});
        }
    };

    deleteCart = async(req, res) => {
        try {
            const { cid } = req.params;
            await this.cartManager.deleteAllProductsFrom(cid);
    
            return res.status(200).send({
                status: "success",
                description: `Se eliminaron todos los productos del carrito con ID ${cid}`
            });
        } catch(error) {
            return res.status(400).send({
                status: "failed",
                description: error.message
            });
        }
    };

    getCart = async(req, res) => {
        try {
            const { cid } = req.params;
            const cart = await this.cartManager.getCartById(cid);
    
            return res.status(200).send({ status: "success", description: cart.products});
    
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message});
        }
    };

    updateCart = async(req, res) => {
        try {
            const { cid } = req.params;
            const products = req.body;
    
            await this.cartManager.updateCartWith(cid, products);
    
            return res.status(200).send({
                status: "success",
                description: `Se actualizo correctamente los productos del carrito con ID ${cid}`
            });
        } catch(error) {
            return res.status(400).send({
                status: "failed",
                description: error.message
            });
        }
    };

    addProductToCart = async(req, res) => {
        try {
            const { cid, pid } = req.params;
            await this.cartManager.addProduct(cid, pid);
    
            return res.status(201).send({ 
                status: "success", 
                description: "El producto fue agregado con éxito al carrito."
            });
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message});
        }
    };

    deleteProductFromCart = async(req, res) => {
        try {
            const { cid, pid } = req.params;
            await this.cartManager.deleteProductFrom(pid, cid);
    
            return res.status(200).send({
                status: "success",
                description: `El producto con ID ${pid} fue eliminado exitosamente del carrito con ID ${cid}`
            });
        } catch(error) {
            return res.status(400).send({
                status: "failed",
                description: error.message
            });
        }
    };

    updateProductFromCart = async(req, res) => {
        try {
            const { cid, pid } = req.params;
            const { quantity } = req.body;
    
            await this.cartManager.updateProductQuantity(cid, pid, quantity);
    
            return res.status(200).send({
                status: "success",
                description: `Se actualizo correctamente la cantidad del producto con ID ${pid} en el carrito con ID ${cid}`
            });
        } catch(error) {
            return res.status(400).send({
                status: "failed",
                description: error.message
            });
        }
    };
}

export { CartsController }