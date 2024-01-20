import { mongoose } from "mongoose";
import { Product } from "../../../main/Product/Product.js"
import productModel from "../../../models/product.model.js";

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

            if(!products.length) {
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
                throw new Error(`No se encontró el producto con DI ${productId}`);
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
}