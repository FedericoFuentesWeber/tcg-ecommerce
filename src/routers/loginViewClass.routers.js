import { LoginViewController } from "../controllers/loginView.controller.js";
import { RouterClass } from "./router.js";

const {
    login,
    register
} = new LoginViewController();

class LoginViewsRouter extends RouterClass {
    init() {
        this.get("/login", ['USER', 'ADMIN'], login);
        this.get("/register", ['USER', 'ADMIN'], register);
    }
}

export { LoginViewsRouter }