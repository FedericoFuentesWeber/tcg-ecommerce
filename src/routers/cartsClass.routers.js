import { RouterClass } from "./router.js";
import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js";

const cartManager = new CartManagerDB();

class CartsRouter extends RouterClass {
    init() {
        this.get('/:cid', ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid } = req.params;
                const cart = await cartManager.getCartById(cid);
        
                return res.status(200).send({ status: "success", description: cart.products});
        
            } catch(error) {
                return res.status(400).send({ status: "failed", description: error.message});
            }
        })

        this.post('/', ['USER', 'ADMIN'], async (req, res) => {
            try {
                const products = req.body;
        
                const { _id: id } = await cartManager.addCart(products);
        
                return res.status(201).send({ 
                    status: "success", 
                    description: "El carrito fue agregado correctamente.",
                    cartId: id.toString()
                });
            } catch(error) {
                return res.status(400).send({ status: "failed", description: error.message});
            }
        })

        this.post("/:cid/products/:pid", ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid, pid } = req.params;
                await cartManager.addProduct(cid, pid);
        
                return res.status(201).send({ 
                    status: "success", 
                    description: "El producto fue agregado con éxito al carrito."
                });
            } catch(error) {
                return res.status(400).send({ status: "failed", description: error.message});
            }
        });
        
        this.delete("/:cid/products/:pid", ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid, pid } = req.params;
                await cartManager.deleteProductFrom(pid, cid);
        
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
        });
        
        this.delete("/:cid", ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid } = req.params;
                await cartManager.deleteAllProductsFrom(cid);
        
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
        });
        
        this.put("/:cid/products/:pid", ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid, pid } = req.params;
                const { quantity } = req.body;
        
                await cartManager.updateProductQuantity(cid, pid, quantity);
        
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
        });
        
        this.put("/:cid", ['USER', 'ADMIN'], async(req, res) => {
            try {
                const { cid } = req.params;
                const products = req.body;
        
                await cartManager.updateCartWith(cid, products);
        
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
        });


    }
}

export { CartsRouter }