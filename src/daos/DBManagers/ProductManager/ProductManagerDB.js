import { mongoose } from "mongoose";
import { Product } from "../../../main/Product/Product.js"
import productModel from "../models/product.model.js";

export class ProductManagerDB {

    createNewProduct = async ({
        title,
        description,
        code,
        category,
        price,
        stock,
        thumbnails
    }) => {
            return new Product({
                id: null,
                title,
                description,
                code,
                category,
                price,
                status: true,
                stock,
                thumbnails
            })
        
    }

    assertCodeIsNotUsed = async(aCode) => {
        try {
            const codeId = (aProduct) => aProduct.code === aCode;
            let products = await this.getProducts();
            if(products.some(codeId)) {
                throw new Error(`El producto con código ${aCode} ya existe.`);
            }
        } catch(error) {
            throw error;
        }
    };

    addProduct = async(product) => {
        try {
            if(
                !product.title || 
                !product.description || 
                !product.code ||
                !product.category ||
                !product.price ||
                !product.stock 
            ) {
                throw new Error("Hay parámetros sin completar.")
            }

            await this.assertCodeIsNotUsed(product.code);
            const newProduct = await this.createNewProduct(product);

            productModel.create(newProduct);
        } catch(error) {
            console.error(error.message);
        }
    }

    getProducts = async () => {
        try {
            const products = await productModel.find({});
            const parsedProducts = products.map(
                (newProduct) => new Product(newProduct)
            );

            return parsedProducts;
        } catch(error) {
            console.error(error.message);
        }
    };

    getProductById = async(productId) => {
        try {
            const products = await productModel.findOne({});

            if(!products) {
                throw new Error("No hay ningún producto.")
            }

            if(!mongoose.Types.ObjectId.isValid(productId)) {
                throw new Error(
                    `El ID ${productId} no es valido.`
                )
            }

            const product = await productModel.findById(productId);

            if(!product) {
                throw new Error(`El producto con el id ${productId} no se encuentra en la lista.`)
            }

            return product;
        } catch(error) {
            console.error(error.message);
            return null;
        }
    };

    deleteProduct = async(productId) => {
        try {
            const productToDelete = await this.getProductById(productId);
            const result = await productModel.deleteOne({ _id: productToDelete.id });

            if(!result.deletedCount >0) {
                throw new Error(`No se encontró el producto con ID ${productId}`);
            }
        } catch(error) {
            throw error;
        }
    };

    updateProduct = async(productId, updatedProduct) => {
        try {
            await productModel.findByIdAndUpdate(
                { _id: productId},
                updatedProduct
            )
        } catch(error) {
            console.error(error.message);
        }
    };

    filteredProductsBy = async(querySearch, queryParams) => {
        try {
            const filteredProducts = await productModel.paginate(querySearch, queryParams);
            return filteredProducts;
        } catch(error) {
            console.error(error.message);
        }
    }

    parseProducts = (productToParse) => {
        const parsedProducts = productToParse.map(
            (product) => new Product(product)
        );

        return parsedProducts;
    }

    stockAvailable = async(pid) => {
        try {
            const product = await this.getProductById(pid);

            return product.stock;
        } catch (error) {
            console.error(error.message);
        }
    }

    buyProduct = async(pid, quantity) => {
        try {
            const product = await this.getProductById(pid);
            if(quantity <= product.stock) {
                const result = await productModel.updateOne(
                    { _id: pid },
                    { $set: { stock: product.stock-quantity } }
                )
    
                if(result.modifiedCount == 0) {
                    throw new Error(
                        `Ocurrio un error al momento de actualizar el stock del producto`
                    );
                }
            }
            
        } catch (error) {
            console.error(error.message);
        }
    }
}