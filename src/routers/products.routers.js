import { Router } from "express";
import { ProductManager } from "../main/ProductManager/ProductManager.js";

const router = Router();
const filePath = "./resources/Products.json";


const productManager = new ProductManager(filePath);

router.get('/', async(req, res) => {
    try {
        const products = await productManager.getProducts();
        const { limit } = req.query;

        if(!limit) {
            return res.status(200).send(products);
        } else {
            const selectedProducts = products.slice(0, limit);
            return res.status(200).send(selectedProducts);
        }

    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.get('/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        const productId = parseInt(pid, 10);
        const foundProduct = await productManager.getProductById(productId);

        return res.status(200).send(foundProduct);

    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.put('/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        await productManager.updateProduct(parseInt(pid, 10), updatedProduct);

        return res.status(200).send({ 
            status: "success", 
            descrition: `El producto con el ID ${pid} fue actualizado correctamente.`
        })
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.delete('/:pid', async(req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(parseInt(pid, 10));

        return res.status(200).send({ 
            status: "success", 
            description: `El producto con el ID ${pid} fue eliminado correctamente.`
        })
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});