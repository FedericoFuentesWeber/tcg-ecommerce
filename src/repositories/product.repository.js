import { ProductDto } from "../dtos/productDto.js";

class ProductRepository {
    constructor(productManager) {
        this.manager = productManager;
    }

    getProducts = async(querySearch, queryParams) => await this.manager.filteredProductsBy(querySearch, queryParams);
    getProduct = async(pid) => await this.manager.getProductById(pid);
    createProduct = async(newProduct) => {
        const newProductDto = new ProductDto(newProduct);
        return await this.manager.addProduct(newProductDto);
    }
    updateProduct = async(pid, updatedProduct) => await this.manager.updateProduct(pid, updatedProduct);
    deleteProduct = async(pid) => await this.manager.deleteProduct(pid);
    getAllProducts = async() => await this.manager.getProducts();
    parseProducts = (docs) => this.manager.parseProducts(docs)

}

export { ProductRepository }