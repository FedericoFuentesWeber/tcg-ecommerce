import { Router } from "express";
import { ProductManagerDB } from "../daos/DBManagers/ProductManager/ProductManagerDB.js";
import { io } from "../app.js";
import { uploader } from "../../utils.js";

const router = Router();

const productManager = new ProductManagerDB();

router.get("/", async(req, res) => {
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

router.get("/:pid", async(req, res) => {
    try {
        const { pid } = req.params;
        const foundProduct = await productManager.getProductById(pid);

        return res.status(200).send(foundProduct);

    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.put("/:pid", async(req, res) => {
    try {
        const { pid } = req.params;
        const updatedProduct = req.body;
        await productManager.updateProduct(pid, updatedProduct);

        return res.status(200).send({ 
            status: "success", 
            descrition: `El producto con el ID ${pid} fue actualizado correctamente.`
        })
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.delete("/:pid", async(req, res) => {
    try {
        const { pid } = req.params;
        await productManager.deleteProduct(pid);

        const updatedProducts = await productManager.getProducts();

        io.emit("updateProductsEvent", updatedProducts);

        return res.status(200).send({ 
            status: "success", 
            description: `El producto con el ID ${pid} fue eliminado correctamente.`
        })
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

router.post("/", uploader.array("thumbnails"), async(req, res) => {
    try {
        const newProduct = req.body;
        
        if(req.files && req.files.length >0) {
            const images = req.files.map((file) => {
                const fullPath = file.path;
                const imagesIndex = fullPath.indexOf("images");
                if(imagesIndex !== -1) {
                    const relativePath = fullPath.substring(imagesIndex -1);
                    return relativePath;
                } else {
                    console.log("Images directory not found");
                    return null;
                }
            });

            newProduct.thumbnails = images.filter((image) => image !== null);
        }

        await productManager.addProduct(newProduct);
        const updatedProducts = await productManager.getProducts();

        io.emit("updateProductsEvent", updatedProducts);

        return res.status(201).send({ 
            status: "success", 
            newProduct
        })
    } catch(error) {
        return res.status(400).send({ status: "failed", description: error.message });
    }
});

export default router;