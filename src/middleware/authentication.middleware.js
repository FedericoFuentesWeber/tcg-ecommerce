import mongoose from "mongoose";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";

const userManager = new UserManagerDB();

const ADMIN_MAIL = "adminCoder@coder.com";
const ADMIN_PASSWORD = "adminCod3r123";
const ADMIN_ROLE = "Admin"

async function auth (req, res, next) {
    try {
        if((req.session?.user.email === ADMIN_MAIL && 
            req.session?.user.role === ADMIN_ROLE) ||
            (await userManager.getUserById(mongoose.Types.ObjectId(req.session?.user.id)))
        ) 
          return next();
    
    } catch (error) {
        return res.redirect("/login");
    }
}

export { auth, ADMIN_MAIL, ADMIN_PASSWORD, ADMIN_ROLE };