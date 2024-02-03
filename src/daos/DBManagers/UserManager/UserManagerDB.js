import { User } from "../../../main/User/User.js";
import userModel from "../../../models/user.model.js";

export class UserManagerDB {
    createNewUser = async ({
        first_name,
        last_name,
        email,
        password
    }) => {
        return new User({
            id: null,
            first_name,
            last_name,
            email,
            password
        })
    };

    addUser = async(user) => {
        try {
            if(
                !user.first_name ||
                !user.last_name ||
                !user.email ||
                !user.password
            ) {
                throw new Error("Hay parámetros sin completar.")
            }

            const newUser = await this.createNewUser(user);

            userModel.create(newUser);
        } catch(error) {
            console.error(error.message);
        }
    };

    getUsers = async() => {
        try {
            return await userModel.find({});
        } catch (error) {
            console.error(error.message);
        }
    };

    getUserById = async(userId) => {
        try {
            const users = await userModel.find({});

            if(!users.length) {
                throw new Error("No hay ningún usuario");
            }

            if(!mongoose.Types.ObjectId.isValid(userId)) {
                throw new Error(
                    `El ID ${userId} no es valido.`
                )
            }

            const user = await userModel.findOne({ _id: userId }).lean();

            if(!user) {
                throw new Error(`El usuario con ID ${userId} no se encuentra en la lista`);
            }

            return user;

        } catch (error) {
            console.error(error.message);
            return null;
        }
    };

    getUserByInformation = async(userEmail, userPassword) => {
        try {
            const users = await userModel.find({});

            if(!users.length) {
                throw new Error("No hay ningún usuario");
            }

            const user = await userModel.findOne({ email: userEmail, password: userPassword }).lean();

            if(!user) {
                throw new Error(`El usuario con ID ${userId} no se encuentra en la lista`);
            }

            return user;

        } catch (error) {
            console.error(error.message);
            return null;
        }
    };

    deleteUser = async(userId) => {
        try {
            const userToDelete = await this.getUserById(userId);
            const result = await userModel.deleteOne({ _id: userToDelete.id });

            if(!result.deletedCount >0) {
                throw new Error(`No se encontró el usuario con ID ${userId}`);
            }
        } catch (error) {
            throw error;
        }
    }

    
}