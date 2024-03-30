import { Router } from "express";
import productRouter from "./products.routers.js";
import cartRouter from "./carts.routers.js";
import chatRouter from "./chat.routers.js"
import productsViewRouter from "./productsViews.routers.js";
import cartsViewRouter from "./cartsViews.routers.js";
import sessionsRouter from "./sessions.routers.js";
import loginViewRouter from "./loginViews.routers.js";
import mailRouter from "./mail.routers.js";
import mockingRouter from "./mocking.routers.js"
// import { LoginViewsRouter } from "./loginViewClass.routers.js";
// import { ProductsViews } from "./productsViewClass.routers.js";
// import { ProductRouter } from "./productsClass.routers.js";
// import { CartsRouter } from "./cartsClass.routers.js";
// import { CartsView } from "./cartsViewClass.routers.js";
// import { ChatRouter } from "./chatClass.routers.js";
// import { SessionRouter } from "./sessionsClass.routers.js";

const router = Router();

router.use("/", loginViewRouter);
router.use("/", productsViewRouter);
router.use("/carts", cartsViewRouter);
router.use("/api/products", productRouter);
router.use("/api/carts", cartRouter);
router.use("/chat", chatRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/", mailRouter);
router.use("/mockingproducts", mockingRouter);
router.get('*', async(req, res) => {
    res.send('NOT FOUND');
});

// const loginViewRouter = new LoginViewsRouter();
// const productsViewRouter = new ProductsViews();
// const productRouter = new ProductRouter();
// const cartsRouter = new CartsRouter();
// const cartsViewRouter = new CartsView();
// const chatRouter = new ChatRouter();
// const sessionsRouter = new SessionRouter();

// router.use('/', loginViewRouter.getRouter());
// router.use('/', productsViewRouter.getRouter());
// router.use('/carts', cartsViewRouter.getRouter());
// router.use('/api/products', productRouter.getRouter());
// router.use('/api/carts', cartsRouter.getRouter());
// router.use('/chat', chatRouter.getRouter());
// router.use('/api/sessions', sessionsRouter.getRouter());

export default router;