import { io } from "../app.js";
import { productService, userService } from "../repositories/index.js";
import { sendEmail } from "../utils/email.js";
import { createPremiumUserProductDeletionEmail } from "../utils/emailBuilder.js";

class ProductController {
    constructor() {
        this.service = productService;
    }

    getProducts = async(req, res) => {
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
            } = await this.service.getProducts(querySearch, queryParams);
    
            return res.status(200).send({
                status: "success",
                payload: this.service.parseProducts(docs),
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
    }

    getProduct = async(req, res) => {
        try {
            const { pid } = req.params;
            const foundProduct = await this.service.getProduct(pid);
    
            return res.status(200).send(foundProduct);
    
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message });
        }
    }

    createProduct = async(req, res) => {
        try {
            const newProduct = req.body;
            console.log("nuevo producto", newProduct)
            
            if(req.files && req.files.length >0) {
                const images = req.files.map((file) => {
                    const fullPath = file.path;
                    const imagesIndex = fullPath.indexOf("products");
                    if(imagesIndex !== -1) {
                        const relativePath = fullPath.substring(imagesIndex -1);
                        return relativePath;
                    } else {
                        console.log("Products directory not found");
                        return null;
                    }
                });
    
                newProduct.thumbnails = images.filter((image) => image !== null);
            }
    
            await this.service.createProduct(newProduct);
            const updatedProducts = await this.service.getAllProducts();
    
            io.emit("updateProductsEvent", updatedProducts);
    
            return res.status(201).send({ 
                status: "success", 
                newProduct
            })
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message });
        }
    }

    updateProduct = async(req, res) => {
        try {
            const { pid } = req.params;
            const updatedProduct = req.body;
            await this.service.updateProduct(pid, updatedProduct);
    
            return res.status(200).send({ 
                status: "success", 
                descrition: `El producto con el ID ${pid} fue actualizado correctamente.`
            })
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message });
        }
    }

    deleteProduct = async(req, res) => {
        try {
            const { pid } = req.params;

            const productToDelete = await this.service.getProduct(pid);
            const { email, role } = await userService.getUserById(productToDelete.owner);

            await this.service.deleteProduct(pid);
    
            if( role == "PREMIUM" ){
                const emailBody = createPremiumUserProductDeletionEmail();

                sendEmail(
                    email,
                    "Un producto eliminado",
                    emailBody
                )
            }
            
            const updatedProducts = await this.service.getAllProducts();
    
            io.emit("updateProductsEvent", updatedProducts);
    
            return res.status(200).send({ 
                status: "success", 
                description: `El producto con el ID ${pid} fue eliminado correctamente.`
            })
        } catch(error) {
            return res.status(400).send({ status: "failed", description: error.message });
        }
    }
}

export { ProductController }