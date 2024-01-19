import { Cart } from "../Cart/Cart.js";
import { promises as fs } from "node:fs";

export class CartManager {
    constructor(filePath) {
        this.path = filePath;
        this.counter = 0;
    }

    generateSequentialID = async() => {
        try {
            this.counter++;
            return this.counter;
        } catch(error) {
            console.error(error.message);
        }
    };

    createNewCart = async(products) => {
        try {
            const id = await this.generateSequentialID();
            return new Cart({
                id,
                products
            })
        } catch(error) {
            console.error(error.message);
        }
    };

    addCart = async(products) => {
        try {

            if (!products || products.length === 0) {
                throw new Error("No hay ningún producto en el carrito.");
            }

            const newCart = await this.createNewCart(products);
            const carts = await this.getCarts();

            carts.push(newCart);

            await fs.writeFile(this.path, JSON.stringify(carts), "utf-8");
        } catch(error) {
            throw error;
        }
    };

    getCarts = async() => {
        try {
            try {
                const cartData = await fs.readFile(this.path, "utf-8");
                const cartJs = await JSON.parse(cartData);

                const parsedCarts = cartJs.map(
                    (newCart) => new Cart(newCart)
                );

                return parsedCarts;
            } catch(error) {
                return [];
            }
        } catch(error) {}
    };

    getCartById = async(cartId) => {
        try {
            const carts = await this.getCarts();

            if(!carts.length) {
                throw new Error("No hay ningún carrito.")
            }

            const cart = carts.find((cart) => cart.id === cartId);

            if(!cart) {
                throw new Error(`El carrito con el id ${cartId} no se encuentra en la lista.`)
            }

            return cart;
        } catch(error) {
            console.error(error.message);
            return null;
        }
    };

    getProducts = async(cartId) => {
        try {
            const cart = await this.getCartById(cartId);
            return cart.products;
        } catch(error) {
            console.error(error.message);
        }
    };

    productAlreadyInCart = async(productId, cartId) => {
        try {
            const products = await this.getProducts(cartId);
            return products.some((product) => product.id === productId);
        } catch(error) {
            throw error;
        }
    }

    addProduct = async(cartId, productId) => {
        try {
            if(!productId) {
                throw new Error("Hay parámetros sin completar.")
            }
            let products = await this.getProducts(cartId);
            let carts = await this.getCarts();

            let cartToUpdate = carts.find((cart) => cart.id === cartId);

            if(await this.productAlreadyInCart(productId, cartId)) {
                const productToUpdate = products.find((product) => product.id === productId);

                const productIndex = products.indexOf(productToUpdate);
                productToUpdate.quantity++;

                if(productIndex !== -1) {
                    products[productIndex] = productToUpdate;
                }
            } else{
                products.push({ id: productId, quantity: 1 });
            }

            const cartIndex = carts.indexOf(cartToUpdate);
            cartToUpdate.products = products;

            if(cartIndex !== -1) {
                carts[cartIndex] = cartToUpdate;
            }

            await fs.writeFile(this.path, JSON.stringify(carts), "utf-8");

        } catch(error) {
            throw error;
        }
    };
}