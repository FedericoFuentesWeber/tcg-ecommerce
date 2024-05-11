import { userService } from "../repositories/index.js";

class UserController {
    constructor() {
        this.service = userService;
    }

    changeRole = async(req, res) => {
        try {
            const { uid } = req.params;
            const user = await this.service.getUserById(uid);

            // user.role == "USER" ? this.service.changeRoleFor(user, "PREMIUM") : this.service.changeRoleFor(user, "USER");
            switch(user.role) {
                case "USER":
                    this.service.changeRoleFor(user, "PREMIUM");
                    break;
                case "PREMIUM":
                    this.service.changeRoleFor(user, "USER");
                    break;
                default:
                    break;
            }

            return res.status(200).send({
                status: "success",
                payload: `El cambio de rol para el usuario con ID ${uid} fue exitoso.`
            })

        } catch (error) {
            return res.status(400).send({
                status: "failed",
                payload: error.message
            })
        }
    };
}

export { UserController }