import { productService } from "../repositories/index.js";

class ProductsViewController {
    constructor() {
        this.service = productService;
    }

    getProducts = async(req, res) => {
        try {
            const products = await this.service.getAllProducts();
    
            res.status(200).render("index", {
                title: "Productos",
                products: products,
                session: req.user
            });
        } catch(error) {
            return res.status(400).render("index", {
                title: "Productos",
                session: req.user,
                errorMessage: error.message
            });
        }
    };

    getRealTimeProducts = async(req, res) => {
        try {
            const products = await this.service.getAllProducts();
            res.status(200).render("realTimeProducts", {
                title: "Productos en tiempo real",
                products: products,
                session: req.user
            });
        } catch(error) {
            return res.status(400).render("index", {
                title: "Productos en tiempo real",
                session: req.user,
                errorMessage: error.message
            });
        }
    };

    getPaginatedProducts = async(req, res) => {
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
            } = await this.service.getProducts(querySearch, queryParams);
    
            const products = this.service.parseProducts(docs);
            res.status(200).render("products", {
                title: "Productos",
                products: products,
                user: req.user,
                hasPrevPage,
                hasNextPage,
                prevPage,
                nextPage,
                page
            });
        } catch(error) {
            return res.status(400).render("products", {
                title: "Productos",
                user: req.user,
                errorMessage: error.message
            });
        }
    };


}

export { ProductsViewController }