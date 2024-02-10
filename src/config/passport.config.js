import passport from 'passport';
import local from 'passport-local';
import userModel from "../models/user.model.js";
import { UserManagerDB } from '../daos/DBManagers/UserManager/UserManagerDB.js';
import { createHash, isValidPassword } from "../../utils.js";

const LocalStrategy = local.Strategy;
const userManager = new UserManagerDB();

const initializePassport = () => {
    passport.use('register', new LocalStrategy({
        passReqToCallback: true,
        usernameField: 'email'
    }, async(req, username, password, done) => {
        const { first_name, last_name, email } = req.body;

        try {
            let foundUser = await userManager.userHasAlreadyBeenAdded(email);
            if(foundUser) return done(null, false);

            const user = await userManager.addUser({
                first_name,
                last_name,
                email,
                password: createHash(password)
            });

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async(username, password, done) => {
        try {
            const user = await userManager.getUserByEmail(username);
            if(!user) {
                console.log(`El usuario con email ${username} no existe`);
                return done(null, false);
            }

            if(!isValidPassword(password, user.password)) {
                return done(null, false);
            }

            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        const user = await userManager.getUserById(id);
        done(null, user);
    });
}

export default initializePassport;