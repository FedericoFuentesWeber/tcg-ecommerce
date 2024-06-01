import { userService } from "../repositories/index.js";

class UsersViewController {
    constructor() {
        this.service = userService
    }

    getAllUsers = async(req, res) => {
        let user = req.user;
        try {
            const users = await this.service.getUsers();

            res.status(200).render("users", {
                title: "Usuarios",
                users: users,
                user: user
            })
        } catch (error) {
            res.status(400).render("users", {
                title: "Usuarios",
                user: user,
                errorMessage: error.message
            });
        }
    }
}

export default UsersViewController;