import { Cart } from "../../../main/Cart/Cart.js";
import { mongoose } from "mongoose";
import cartModel from "../../../models/cart.model.js"

export class CartManagerDB {

    createNewCart = async(products) => {
        try {
            return new Cart({
                id: null,
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
            cartModel.create(newCart);
        } catch(error) {
            throw error;
        }
    };

    getCarts = async() => {
        try {
            const carts = await cartModel.find({});
        } catch(error) {
            console.error(error.message);
        }
    };

    getCartById = async(cartId) => {
        try {
            const carts = await cartModel.find({});

            if(!carts.length) {
                throw new Error("No hay ningún carrito.")
            }

            if(!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error(
                    `El ID ${cartId} no es valido.`
                )
            }

            const cart = await cartModel.findById(cartId);

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
            const cart = await this.getCartById(cartId);
            let products = cart.products;

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

            await cartModel.findByIdAndUpdate(
                { _id: cartId },
                { products: products}
            );

        } catch(error) {
            throw error;
        }
    };
}