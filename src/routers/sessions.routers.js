import { Router } from "express";
import passport from 'passport';
import { passportCall } from "../middleware/passportCall.middleware.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { SessionController } from "../controllers/sessions.controller.js";

const router = Router();
const {
    login,
    register,
    logout
} = new SessionController();

router.get('/github', passport.authenticate('github', {scope:['user: email']}), async(req, res) => {});
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/logout', logout);
router.post('/login', login);
router.post('/register', register);

router.get('/current', passportCall('jwt'), authorization("USER"), async(req, res) => {
    res.send({
        message:"Datos sensibles"
    });
});

export default router;