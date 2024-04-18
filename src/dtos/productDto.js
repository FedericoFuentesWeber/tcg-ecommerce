class ProductDto {
    constructor(product) {
        this.title = product.title;
        this.description = product.description;
        this.code = product.code;
        this.category = product.category;
        this.price = product.price;
        this.stock = product.stock;
        this.thumbnails = product.thumbnails;
        this.owner = product.owner;
    }
}

export { ProductDto }