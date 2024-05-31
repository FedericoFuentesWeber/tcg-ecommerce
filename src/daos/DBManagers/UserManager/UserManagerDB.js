import { User } from "../../../main/User/User.js";
import userModel from "../models/user.model.js";
import mongoose from "mongoose";
import { CartManagerDB } from "../CartManager/CartManagerDB.js";
import CustomError from "../../../utils/errors/CustomError.js";
import { generateUserErrorInfo } from "../../../utils/errors/info.js";
import { EErrors } from "../../../utils/errors/enums.js";
import { config } from "../../../config/config.js";
import { createHash } from "../../../utils/bcrypt.js";
import { UserDto } from "../../../dtos/userDto.js";

const cartManager = new CartManagerDB();

export class UserManagerDB {
    createNewUser = async ({
        first_name,
        last_name,
        email,
        password,
        age
    }) => {
        const { _id: id } = await cartManager.addCart();
        return new User({
            id: null,
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            age: age,
            cartId: id
        })
    };

    addUser = async(user) => {
        if (user.email === config.ADMIN_MAIL) {
            const { _id: id } = await cartManager.addAdminCart();
            const adminUser = new User({
                id: config.ADMIN_ID,
                first_name: "Admin",
                last_name: "Admin",
                email: config.ADMIN_MAIL,
                password: user.password,
                age: 0,
                cartId: id
            });
            adminUser.role = "ADMIN";
            return await userModel.create(adminUser);
        } else {
            try {
                if(
                    !user.first_name ||
                    !user.last_name ||
                    !user.age ||
                    !user.email
                ) {
                    CustomError.createError({
                        name: "User creation failed",
                        cause: generateUserErrorInfo(user),
                        message: "Error creating new user",
                        code: EErrors.INSTANCE_CREATION_ERROR
                    });
                }
    
                const newUser = await this.createNewUser(user);
                return await userModel.create(newUser);
                
            } catch(error) {
                console.error(error.message);
            }
        }
    };

    getUsers = async() => {
        try {
            const users = await userModel.find({});
            
            const parsedUsers = users.map(
                (newUser) => new User(newUser)
            );
            return parsedUsers;
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
                throw new Error(`El usuario con email ${userEmail} no se encuentra en la lista`);
            }

            return user;

        } catch (error) {
            console.error(error.message);
            return null;
        }
    };

    getUserByEmail = async(userEmail) => {
        try {
            const users = await userModel.find({});

            if(!users.length) {
                throw new Error("No hay ningún usuario");
            }

            const user = await userModel.findOne({ email: userEmail }).lean();
            if(!user) {
                throw new Error(`El usuario con email ${userEmail} no se encuentra en la lista`);
            }

            return user;
        } catch (error) {
            console.error(error.message);
            return null;
        }
    }

    changeRoleFor = async(userId, newRole) => {
        try {
            await userModel.findByIdAndUpdate(
                userId,
                { role: newRole }
            );
        } catch (error) {
            console.error(error.message);
            return null
        }
    }

    changePasswordFor = async(user, newPassword) => {
        try {
            await userModel.findByIdAndUpdate(
                user._id,
                { password: newPassword }
            );
        } catch (error) {
            console.error(error.message);
            return null;   
        }
    }

    deleteUser = async(userId) => {
        try {
            const userToDelete = await this.getUserById(userId);
            console.log("user to delete", userToDelete);
            const result = await userModel.deleteOne({ _id: userToDelete._id });

            if(!result.deletedCount >0) {
                throw new Error(`No se encontró el usuario con ID ${userId}`);
            }
        } catch (error) {
            throw error;
        }
    }

    updateLastConnection = async(userId) => {
        try {
            await userModel.findByIdAndUpdate(userId, {
                lastConnection: new Date() 
            });
        } catch (error) {
            throw error;
        }
    }

    addDocuments = async(userId, documentsToAdd) => {
        try {
            await userModel.findByIdAndUpdate(userId, {
                documents: documentsToAdd
            });
        } catch (error) {
            throw error;
        }
    }
    
}