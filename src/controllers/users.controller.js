import { userService } from "../repositories/index.js";
import { User } from "../main/User/User.js";
import CustomError from "../utils/errors/CustomError.js";
import { EErrors } from "../utils/errors/enums.js";
import { createInactiveUserEmail } from "../utils/emailBuilder.js";
import { sendEmail } from "../utils/email.js";

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
                        this.service.changeRoleFor(uid, "PREMIUM");
                    } else {
                        throw CustomError.createError({
                            name: "Error changing role",
                            code: EErrors.DATABASE_ERROR,
                            cause: "Some documents are missing"
                        })
                    }
                    break;
                case "PREMIUM":
                    this.service.changeRoleFor(uid, "USER");
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
            
            if(!req.files) {
                return res.status(400).send({ status: "failed", payload: "No files uploaded" });
            }

            const documentsToAdd = Array.from(req.files).map(file => {
                const { originalname, path } = file;

                //This is done because the files extensions are not specified
                const lastDotIndex = originalname.lastIndexOf(".");
                const name = lastDotIndex === -1 ? originalname : originalname.substring(0, lastDotIndex);

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

    deleteUser = async(req, res) => {
        try {
            const { uid } = req.params;
            await this.service.deleteUser(uid);

            return res.status(200).send({
                status: "success",
                payload: `El usuario con ID ${uid} fue eliminado correctamente.`
            });
        } catch (error) {
            return res.status(400).send({
                status: "failed",
                payload: error.message
            })
        }
    }

    deleteInactiveUsers = async(req, res) => {
        try {
            const inactiveUsers = await this.service.getInactiveUsers();

            await this.service.deleteUsers(inactiveUsers);

            for(const user of inactiveUsers) {
                const email = user.email;
                const emailBody = createInactiveUserEmail();

                sendEmail(
                    email,
                    "Su cuenta fue eliminada por inactividad",
                    emailBody
                );
            }

            return res.status(200).send({
                status: "success",
                payload: "Los usuarios inactivos fueron eliminados exitosamente."
            })
        } catch (error) {
            return res.status(400).send({
                status: "failed",
                payload: error.message
            })
        }
    }
}

export { UserController }