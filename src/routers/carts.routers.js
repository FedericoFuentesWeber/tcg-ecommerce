import { Router } from "express";
import { CartManager } from "../main/CartManager/CartManager.js";

const router = Router();
const filePath = "./resources/Carts.json";

const cartManager = new CartManager(filePath);

router.post("/", async(req, res) => {
    try {
        await cartManager.addCart();

        return res.status(200).send({ 
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

router.post("/:cid/product/:pid", async(req, res) => {
    try {
        const { cid, pid } = req.params;
        await cartManager.addProduct(cid, pid);

        return res.status(200).send({ 
            status: "success", 
            description: "El producto fue agregado con éxito al carrito."
        });
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message});
    }
});