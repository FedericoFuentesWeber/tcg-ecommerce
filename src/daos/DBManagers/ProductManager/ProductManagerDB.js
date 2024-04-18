import { mongoose } from "mongoose";
import { Product } from "../../../main/Product/Product.js"
import productModel from "../models/product.model.js";
import CustomError from "../../../utils/errors/CustomError.js";
import { generateProductErrorInfo, objectAlreadyIncludedErrorInfo } from "../../../utils/errors/info.js";
import { EErrors } from "../../../utils/errors/enums.js";

export class ProductManagerDB {

    createNewProduct = async ({
        title,
        description,
        code,
        category,
        price,
        stock,
        thumbnails,
        owner
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
                thumbnails,
                owner: owner ? owner : null
            })
        
    }

    assertCodeIsNotUsed = async(aCode) => {
        try {
            const codeId = (aProduct) => aProduct.code === aCode;
            let products = await this.getProducts();
            if(products.some(codeId)) {
                CustomError.createError({
                    name: "Object already included",
                    cause: objectAlreadyIncludedErrorInfo(aCode),
                    message: `El producto con código ${aCode} ya existe.`,
                    code: EErrors.OBJECT_INCLUDED_ERROR
                });
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
                CustomError.createError({
                    name: "Product creation failure",
                    cause: generateProductErrorInfo(product),
                    message: "Error creating new product",
                    code: EErrors.INSTANCE_CREATION_ERROR 
                });
            }

            await this.assertCodeIsNotUsed(product.code);
            const newProduct = await this.createNewProduct(product);

            productModel.create(newProduct);
        } catch(error) {
            throw(error);
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
            throw(error);
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