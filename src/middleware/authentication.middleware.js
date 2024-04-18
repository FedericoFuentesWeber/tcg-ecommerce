import mongoose from "mongoose";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";
import { config } from "../config/config.js";

const userManager = new UserManagerDB();

const ADMIN_MAIL = config.ADMIN_MAIL;
const ADMIN_PASSWORD = config.ADMIN_PASSWORD;
const ADMIN_ROLE = config.ADMIN_ROLE;

async function auth (req, res, next) {
    try {
        if((req.session?.user.email === ADMIN_MAIL && 
            req.session?.user.role === ADMIN_ROLE) ||
            (await userManager.getUserById(mongoose.Types.ObjectId(req.session?.user._id)))
        ) 
          return next();
    
    } catch (error) {
        return res.redirect("/login");
    }
}

export { auth, ADMIN_MAIL, ADMIN_PASSWORD, ADMIN_ROLE };