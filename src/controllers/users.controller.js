import { userService } from "../repositories/index.js";

class UserController {
    constructor() {
        this.service = userService;
    }

    getAllUsers = async(req, res) => {
        const users = await this.service.getUsers();

        res.send({
            status:"success",
            payload: users
        })
    }

    getUserById = async(req, res) => {
        const { uid } = req.params;
        const user = await this.service.getUserById(uid);
        res.send({
            status: "success",
            payload: user
        })
    }
}

export { UserController }