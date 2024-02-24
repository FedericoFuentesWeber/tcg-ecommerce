import { RouterClass } from "./router.js";
import { ProductManagerDB } from "../daos/DBManagers/ProductManager/ProductManagerDB.js";

const productManager = new ProductManagerDB();

class ProductsViews extends RouterClass {
    init() {
        this.get('/products', ['PUBLIC', 'USER', 'ADMIN'], async(req, res) => {
            try {
                const {
                    limit: queryLimit = 10,
                    page: queryPage = 1,
                    sort: querySort,
                    query
                } = req.query;
        
                const queryParams = {
                    limit: parseInt(queryLimit),
                    page: parseInt(queryPage),
                    lean: true,
                    ...(querySort && { sort: { price: querySort } })
                };
        
                let querySearch = {};
                if(query) {
                    const [field, value] = query.split(":");
                    if(field && value) {
                        querySearch = { [field]: value };
                    }
                }
        
                const {
                    docs,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                    page
                } = await productManager.filteredProductsBy(querySearch, queryParams);
        
                const products = productManager.parseProducts(docs);
                res.status(200).render("products", {
                    title: "Productos",
                    products: products,
                    user: req.session?.user,
                    hasPrevPage,
                    hasNextPage,
                    prevPage,
                    nextPage,
                    page
                });
            } catch(error) {
                return res.status(400).render("products", {
                    title: "Productos",
                    user: req.session?.user,
                    errorMessage: error.message
                });
            }
        });
        this.get('/realtimeproducts', ['PUBLIC', 'USER', 'ADMIN'], async(req, res) => {
            try {
                const products = await productManager.getProducts();
                res.status(200).render("realTimeProducts", {
                    title: "Productos en tiempo real",
                    products: products,
                    session: req.session?.user
                });
            } catch(error) {
                return res.status(400).render("index", {
                    title: "Productos en tiempo real",
                    session: req.session?.user,
                    errorMessage: error.message
                });
            }
        });
    }
}

export { ProductsViews }