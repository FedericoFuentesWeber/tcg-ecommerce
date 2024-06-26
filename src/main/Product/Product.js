export class Product {
    constructor({id, title, description, code, price, status, stock, category, thumbnails, owner}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.code = code;
        this.price = price;
        this.status = status;
        this.stock = stock;
        this.category = category;
        !thumbnails ? (this.thumbnails= []) : (this.thumbnails = thumbnails);
        this.owner = owner;
    }
}