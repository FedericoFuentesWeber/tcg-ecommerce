import { Router } from "express";
import { CartManagerDB } from "../daos/DBManagers/CartManager/CartManagerDB.js";

const router = Router();

const cartManager = new CartManagerDB();

router.post("/", async (req, res) => {
    try {
        const products = req.body;

        await cartManager.addCart(products);

        return res.status(201).send({ 
            status: "success", 
            description: "El carrito fue agregado correctamente."
        });
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message});
    }
});

router.get("/:cid", async(req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.getCartById(cid);

        return res.status(200).send({ status: "success", description: cart.products});

    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message});
    }
});

router.post("/:cid/products/:pid", async(req, res) => {
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

router.delete("/:cid/products/:pid", async(req, res) => {
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

router.delete("/:cid", async(req, res) => {
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

router.put("/:cid/products/:pid", async(req, res) => {
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

router.put("/:cid", async(req, res) => {
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

export default router;