import { RouterClass } from "./router.js";
import { ProductManagerDB } from "../daos/DBManagers/ProductManager/ProductManagerDB.js";
import { io } from "../app.js";
import { uploader } from "../../utils.js";

class ProductRouter extends RouterClass {
    init() {
        this.get('/', ['PUBLIC'], async(req, res) => {
            try {
                const {
                    limit: queryLimit = 10,
                    page: queryPage  =1,
                    sort: querySort,
                    query
                } = req.query;
        
                const queryParams = {
                    limit: parseInt(queryLimit),
                    page: parseInt(queryPage),
                    lean: true,
                    ...(querySort && { sort: { price: querySort } })
                };
        
                let querySearch = {};
                if(query) {
                    const [field, value] = query.split(":");
                    if(field && value) {
                        querySearch = { [field]: value };
                    }
                }
        
                const {
                    docs,
                    totalPages,
                    prevPage,
                    nextPage,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                } = await productManager.filteredProductsBy(querySearch, queryParams);
        
                return res.status(200).send({
                    status: "success",
                    payload: productManager.parseProducts(docs),
                    totalPages,
                    prevPage,
                    nextPage,
                    page,
                    hasPrevPage,
                    hasNextPage,
                    prevLink,
                    nextLink
                });
            } catch(error) {
                return res.status(400).send({
                    status: "failed",
                    payload: error.message
                });
            }
        });

        this.get('/:pid', ['PUBLIC'], async(req, res) => {
            try {
                const { pid } = req.params;
                const foundProduct = await productManager.getProductById(pid);
        
                return res.status(200).send(foundProduct);
        
            } catch(error) {
                return res.status(400).send({ status: "failed", description: error.message });
            }
        });

        this.put('/:pid', ['PUBLIC'], async(req, res) => {
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

        this.delete('/:pid', ['PUBLIC'], async(req, res) => {
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

        this.post('/', ['PUBLIC'], uploader.array("thumbnails"), async(req, res) => {
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
        })
    }
}

export { ProductRouter }