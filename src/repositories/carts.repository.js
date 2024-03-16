class CartRepository {
    constructor(cartManager) {
        this.manager = cartManager;
    }

    createCart = async () => await this.manager.addCart();
    deleteCart = async (cid) => await this.manager.deleteAllProductsFrom(cid);
    getCart = async (cid) => await this.manager.getCartById(cid);
    updateCart = async (cid, products) => await this.manager.updateCartWIth(cid, products);
    addProductToCart = async (cid, pid) => await this.manager.addProduct(cid, pid);
    deleteProductFromCart = async (cid, pid) => await this.manager.deleteProductFrom(pid, cid);
    updateProductFromCart = async (cid, pid, quantity) => await this.manager.updateProductQuantity(cid, pid, quantity);
    finalizePurchase = async (cid) => await this.manager.buyCartProducts(cid);
}

export { CartRepository }