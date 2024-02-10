import { Router } from "express";

const router = Router();

router.get("/login", async(req, res) => {
    try {
        res.status(200).render("login");
    } catch (error) {
        return res.status(400).render("login", {
            title: "Login",
            errorMessage: error.message
        });
    }
});

router.get("/register", async(req, res) => {
    try {
        res.status(200).render("register");
    } catch (error) {
        return res.status(400).render("register", {
            title: "Register",
            errorMessage: error.message
        });
    }
})

export default router;