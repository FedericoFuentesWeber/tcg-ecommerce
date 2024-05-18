import { userService } from "../repositories/index.js";
import { User } from "../main/User/User.js";

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

    changeRole = async(req, res) => {
        try {
            const { uid } = req.params;
            const user = new User(await this.service.getUserById(uid));

            // user.role == "USER" ? this.service.changeRoleFor(user, "PREMIUM") : this.service.changeRoleFor(user, "USER");
            switch(user.role) {
                case "USER":
                    if(user.allDocumentsRequiredLoaded()) {
                        this.service.changeRoleFor(user, "PREMIUM");
                    } else {
                        //Throw error
                    }
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

    addDocuments = async(req, res) => {
        try {
            const { uid } = req.params;
            
            const documentsToAdd = Array.from(req.files).map(file => {
                const { originalName, path } = file;

                //This is done because the files extensions are not specified
                const lastDotIndex = originalName.lastIndexOf(".");
                const name = lastDotIndex === -1 ? originalName : originalName.substring(0, lastDotIndex);

                return {
                    name: name,
                    reference: path
                };
            });

            await this.service.addDocuments(uid, documentsToAdd);

            return res.status(200).send({
                status: "success",
                payload: `Los archivos del usuario ${uid} fueron agregados con exito.`
            });

        } catch (error) {
            return res.status(400).send({
                status: "failed",
                payload: error.message
            })
        }
    }
}

export { UserController }