import { Router } from "express";
import productRouter from "./products.routers.js";
import cartRouter from "./carts.routers.js";
import chatRouter from "./chat.routers.js"
import productsViewRouter from "./productsViews.routers.js";
import cartsViewRouter from "./cartsViews.routers.js";
import sessionsRouter from "./sessions.routers.js";
import loginViewRouter from "./loginViews.routers.js";

// import { ProductsViews } from "./productsViewClass.routers.js";
// import { ProductRouter } from "./productsClass.routers.js";


const router = Router();
// const productsViewsRouter = new ProductsViews();
// const productsRouter = new ProductRouter();

// router.use("/", productsViewsRouter.getRouter());
// router.use('/api/products', productsRouter.getRouter());

router.use("/", loginViewRouter);
router.use("/", productsViewRouter);
router.use("/carts", cartsViewRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/chat", chatRouter);
router.use("/api/sessions", sessionsRouter);
router.get('*', async(req, res) => {
    res.send('NOT FOUND');
})

export default router;