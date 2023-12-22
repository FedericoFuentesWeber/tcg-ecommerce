import { Product } from "../Product/Product.js";
import { promises as fs } from "node:fs";

export class ProductManager {

    constructor(filePath) {
        this.path = filePath;
        this.counter = 0;
    }

    generateSequentialID = async() => {
        this.counter++;
        return this.counter;
    }

    createNewProduct = async ({
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
    }) => {
        const id = await this.generateSequentialID();
    
            return new Product({
                id,
                title,
                description,
                price,
                thumbnail,
                code,
                stock
            })
        
    }

    assertCodeIsNotUsed = async(aCode) => {
        const codeId = (aProduct) => aProduct.code === aCode;
        let products = await this.getProducts();
        if(products.some(codeId)) {
            const errorMessage = `El producto con código ${aCode} ya existe.`;
            console.error(errorMessage);
            throw new Error(errorMessage);
        }
    };

    addProduct = async(product) => {
        try {
            if(!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                throw new Error("Hay parámetros sin completar.")
            }

            await this.assertCodeIsNotUsed(product.code);
            const newProduct = await this.createNewProduct(product);

            let products = await this.getProducts();
            products.push(newProduct);

            await fs.writeFile(this.path, JSON.stringify(products), "utf-8");
        } catch(error) {
            console.error(error.message);
        }
    }

    getProducts = async () => {
        try {
            try {
                const productData = await fs.readFile(this.path, "utf-8");
                const productJs = await JSON.parse(productData);

                const parsedProducts = productJs.map(
                    (newProduct) => new Product(newProduct)
                );

                return parsedProducts;
            } catch(error) {
                return [];
            }
        } catch(error) {}
    };

    getProductById = async(productId) => {
        try {
            const products = await this.getProducts();

            if(!products.length) {
                throw new Error("No hay ningún producto.")
            }

            const product = products.find((product) => product.id === productId);

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
            let products = await this.getProducts();

            const filteredProducts = products.filter((product) => product.id !== productId);

            await fs.writeFile(this.path, JSON.stringify(filteredProducts), "utf-8");
        } catch(error) {}
    };

    updateProduct = async(productId, updatedProduct) => {
        try {
            let products = await this.getProducts();

            const productToUpdate = products.find((product) => product.id === productId);

            updatedProduct.id = productId;

            const index = products.indexOf(productToUpdate);

            if(index !== -1) {
                products[index] = updatedProduct;
            }

            await fs.writeFile(this.path, JSON.stringify(products), "utf-8");
        } catch(error) {}
    };
}