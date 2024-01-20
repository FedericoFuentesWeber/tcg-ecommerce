import { Router } from "express";
import { CartManager } from "../daos/FileBasedManagers/CartManager/CartManager.js";

const router = Router();
const filePath = "./resources/Carts.json";

const cartManager = new CartManager(filePath);

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
        const cart = await cartManager.getCartById(parseInt(cid, 10));

        return res.status(200).send({ status: "success", description: cart.products});

    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message});
    }
});

router.post("/:cid/product/:pid", async(req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.addProduct(parseInt(cid, 10), parseInt(pid, 10));

        return res.status(201).send({ 
            status: "success", 
            description: "El producto fue agregado con éxito al carrito."
        });
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message});
    }
});

export default router;