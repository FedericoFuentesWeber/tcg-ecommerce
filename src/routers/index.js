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
// import { CartsRouter } from "./cartsClass.routers.js";
// import { CartsView } from "./cartsViewClass.routers.js";
// import { ChatRouter } from "./chatClass.routers.js";
// import { SessionRouter } from "./sessionsClass.routers.js";
// import { LoginViewsRouter } from "./loginViewClass.routers.js";


const router = Router();
// const loginViewRouter = new LoginViewsRouter();
// const productsViewsRouter = new ProductsViews();
// const productsRouter = new ProductRouter();
// const cartsRouter = new CartsRouter();
// const cartsViewsRouter = new CartsView();
// const chatRouter = new ChatRouter();
// const sessionRouter = new SessionRouter();

// router.use('/', loginViewRouter.getRouter());
// router.use("/", productsViewsRouter.getRouter());
// router.use('/api/products', productsRouter.getRouter());
// router.use('/api/carts', cartsRouter.getRouter());
// router.use('/carts', cartsViewsRouter.getRouter());
// router.use('/chat', chatRouter.getRouter());
// router.use('/api/sessions', sessionRouter.getRouter());

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