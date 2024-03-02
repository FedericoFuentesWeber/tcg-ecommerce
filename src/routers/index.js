import { Router } from "express";
import productRouter from "./products.routers.js";
import cartRouter from "./carts.routers.js";
import chatRouter from "./chat.routers.js"
import productsViewRouter from "./productsViews.routers.js";
import cartsViewRouter from "./cartsViews.routers.js";
import sessionsRouter from "./sessions.routers.js";
import loginViewRouter from "./loginViews.routers.js";

const router = Router();

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