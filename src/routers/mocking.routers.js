import { Router } from "express";
import { generateProducts } from "../utils/mocker.js";

const router = Router();

router.get("/", (req, res) => {
    let products = [];

    for( let i = 0; i<100; i++ ) {
        products.push(generateProducts());
    }

    res.send({
        status: "success",
        payload: products
    });
})

export default router;