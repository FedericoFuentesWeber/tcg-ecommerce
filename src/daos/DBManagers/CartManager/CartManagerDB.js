import { Cart } from "../../../main/Cart/Cart.js";
import { mongoose } from "mongoose";
import cartModel from "..//models/cart.model.js"
import { ProductManagerDB } from "../ProductManager/ProductManagerDB.js"
import { TicketManagerDB } from "../TicketManager/TicketManagerDB.js";
import { config } from "../../../config/config.js";

const productManager = new ProductManagerDB();
const ticketManager = new TicketManagerDB();

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

    addAdminCart = async() => {
        try {
            const adminCart = new Cart({
                id: config.ADMIN_ID,
                products: []
            });

            return cartModel.create(adminCart);
        } catch (error) {
            throw error;
        }
    };

    addCart = async() => {
        try {
            const newCart = await this.createNewCart([]);
            return cartModel.create(newCart);
        } catch(error) {
            throw error;
        }
    };

    getCarts = async() => {
        try {
            return await cartModel.find({});
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

            const cart = await cartModel.findOne({ _id: cartId }).lean();

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
            const cart = await cartModel.findOne({
                _id: cartId,
                "products.product": productId
            });
            return !!cart;
        } catch(error) {
            throw error;
        }
    }

    findProductIn = async(productId, cartId) => {
        try {
            const product = await cartModel.findOne(
                { _id: cartId, "products.product": productId },
                { "products.$": 1 }
            );

            if(product && product.products.length >0) {
                return product.products[0];
            } else {
                throw new Error(
                    `El producto con ID ${productId} no se encuentra en el carrito con ID ${cartId}`
                );
            }
        } catch(error) {
            throw error;
        }
    }

    addProduct = async(cartId, productId) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error(
                    `El ID ${cartId} no es valido.`
                )
            }
            const cart = await cartModel.findById(cartId);
            console.log("cart", cart);
            if(!cart) {
                throw new Error(`El carrito con el id ${cartId} no se encuentra en la lista.`)
            }

            try {
                await productManager.getProductById(productId);
            } catch(error) {
                throw error;
            }

            if(await this.productAlreadyInCart(productId, cartId)) {
                const { quantity } = await this.findProductIn(productId, cartId);
                await this.updateProductQuantity(cartId, productId, quantity+1);
            } else{
                await cartModel.updateOne(
                    { _id: cartId },
                    { $push: { products: { product: productId, quantity: 1 } } }
                );
            }
        } catch(error) {
            throw error;
        }
    };

    deleteProductFrom = async(productId, cartId) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error(
                    `El ID ${cartId} no es valido.`
                )
            }
            const cart = await cartModel.findById({ _id: cartId });
            if(!cart) {
                throw new Error(`El carrito con el id ${cartId} no se encuentra en la lista.`)
            }

            try {
                await productManager.getProductById(productId);
            } catch(error) {
                throw error;
            }

            if(await this.productAlreadyInCart(productId, cartId)) {
                const result = await cartModel.updateOne(
                    { _id: cartId },
                    { $pull: { products: { product: productId } } }
                );

                if(result.modifiedCount == 0) {
                    throw new Error(`Ocurrio un error al momento de borrar el producto`);
                }
            } else {
                throw new Error(
                    `El producto con ID ${productId} no se encuentra en el carrito con ID ${cartId}`
                );
            }

        } catch(error) {
            throw error;
        }
    };

    deleteAllProductsFrom = async(cartId) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error(
                    `El ID ${cartId} no es valido.`
                )
            }

            const cart = await cartModel.findById(cartId);
            if(!cart) {
                throw new Error(`El carrito con el id ${cartId} no se encuentra en la lista.`)
            }

            const result = await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: [] } }
            );

            if(result.modifiedCount == 0) {
                throw new Error(`Ocurrio un error al momento de borrar los productos`);
            }

        } catch(error) {
            throw error;
        }
    };

    updateProductQuantity = async(cartId, productId, productQuantity) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error(
                    `El ID ${cartId} no es valido.`
                )
            }

            const cart = await cartModel.findById(cartId);
            if(!cart) {
                throw new Error(`El carrito con el id ${cartId} no se encuentra en la lista.`)
            }

            try {
                await productManager.getProductById(productId);
            } catch(error) {
                throw error;
            }

            if(await this.productAlreadyInCart(productId, cartId)) {
                const result = await cartModel.updateOne(
                    { _id: cartId, "products.product": productId},
                    { $set: { "products.$.quantity": productQuantity } }
                );

                if(result.modifiedCount == 0) {
                    throw new Error(
                        `Ocurrio un error al momento de actualizar la cantidad del producto`
                    );
                }
            } else {
                throw new Error(
                    `El producto con ID ${productId} no se encuentra en el carrito con ID ${cartId}`
                );
            }

        } catch(error) {
            throw error;
        }
    };

    updateCartWith = async(cartId, newProducts) => {
        try {
            if(!mongoose.Types.ObjectId.isValid(cartId)) {
                throw new Error(
                    `El ID ${cartId} no es valido.`
                )
            }

            const cart = await cartModel.findById(cartId);
            if(!cart) {
                throw new Error(`El carrito con el id ${cartId} no se encuentra en la lista.`)
            }

            const result = await cartModel.updateOne(
                { _id: cartId },
                { $set: { products: newProducts } }
            );

            if(result.modifiedCount == 0) {
                throw new Error(
                    `Ocurrio un error al momento de actualizar los productos del carrito`
                );
            }
        } catch(error) {
            throw error;
        }
    };

    buyCartProducts = async(cid, purchaser) => {
        try {
            const products = await this.getProducts(cid);
            let boughtProducts = [];
            if (!products || products.length === 0) {
                throw new Error("No hay ningún producto en el carrito.");
            }

            products.forEach((item) => {
                if(item.product.stock >= item.quantity) {
                    productManager.buyProduct(item.product._id, item.quantity);
                    this.deleteProductFrom(item.product._id, cid);
                    boughtProducts.push(item);
                }
            });

            if(boughtProducts.length) {
                const ticket = await ticketManager.addTicket(boughtProducts, purchaser);

                let response = {
                    ticket: ticket,
                    allItemsBought: false
                }

                if(products.length === boughtProducts.length) {
                    response.allItemsBought = true;
                }

                return response;
            } else {
                return {
                    allItemsBought: false
                }
            }

        } catch (error) {
            throw error;
        }
    };    
}