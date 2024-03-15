import { RouterClass } from "./router.js";
import passport from 'passport';
import { SessionController } from "../controllers/sessions.controller.js";

const {
    login,
    register,
    logout
} = new SessionController();
class SessionRouter extends RouterClass {
    init() {
        this.post('/login', ['USER', 'ADMIN'], login);
        this.post('/register', ['USER', 'ADMIN'], register);
        this.get('/logout', ['USER', 'ADMIN'], logout);

        this.get('/github', ['USER', 'ADMIN'], passport.authenticate('github', {scope:['user: email']}), async(req, res) => {});
        this.get('/githubcallback', ['ADMIN'], passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
            req.session.user = req.user;
            res.redirect('/products');
        });
    }
}

export { SessionRouter }