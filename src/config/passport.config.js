import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import { UserManagerDB } from '../daos/DBManagers/UserManager/UserManagerDB.js';
import { createHash, isValidPassword } from "../../utils.js";
import userModel from '../models/user.model.js';
import mongoose from 'mongoose';
import passportJWT from 'passport-jwt';
import { PRIVATE_KEY } from '../../public/js/jsonwebtoken.js';

// const LocalStrategy = local.Strategy;
const userManager = new UserManagerDB();

// const initializePassport = () => {
//     passport.use('register', new LocalStrategy({
//         passReqToCallback: true,
//         usernameField: 'email'
//     }, async(req, username, password, done) => {
//         const { first_name, last_name, email } = req.body;

//         try {
//             let foundUser = await userModel.findOne({email});
//             if(foundUser) return done(null, false);

//             const user = await userManager.addUser({
//                 first_name,
//                 last_name,
//                 email,
//                 password: createHash(password)
//             });

//             return done(null, user);
//         } catch (error) {
//             return done(error);
//         }
//     }));

//     passport.use('login', new LocalStrategy({
//         usernameField: 'email'
//     }, async(username, password, done) => {
//         console.log("during login...")
//         try {
//             const user = await userManager.getUserByEmail(username);
//             if(!user) {
//                 console.log(`El usuario con email ${username} no existe`);
//                 return done(null, false);
//             }

//             if(!isValidPassword(password, user.password)) {
//                 console.log("invalid pass");
//                 return done(null, false);
//             }

//             return done(null, user);
//         } catch (error) {
//             return done(error);
//         }
//     }));

//     passport.serializeUser((user, done) => {
//         done(null, user._id);
//     });

//     passport.deserializeUser(async (id, done) => {
//         const user = await userModel.findById({_id: id});
//         done(null, user);
//     });

//     passport.use('github', new GithubStrategy({
//         clientID: 'Iv1.ec6d76754baf8cd7',
//         clientSecret: 'f74b24c52d60aaa66a3dfe703f88e4c8f7fbcb66',
//         callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
//     }, async(accessToken, refreshToken, profile, done) => {
//         console.log('profile', profile);
//         try {
//             let foundUser = await userModel.findOne({email: profile._json.email});
//             console.log("user", foundUser);
//             if(foundUser === null) {
//                 let user = await userManager.addUser({
//                     first_name: profile._json.name,
//                     last_name: profile._json.name,
//                     email: profile._json.email,
//                     password: ''
//                 });

//                 return done(null, user);
//             }

//             return done(null, foundUser);
//         } catch (error) {
//             return done(error);
//         }
//     }));
// }

const JWTStrategy  = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;

const initializePassport = () => {

    const cookieExtractor = (req) =>{
        let token = null;

        if(req && req.cookies) {
            token = req.cookies['cookieToken']
        }

        return token;
    }

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }))
}

export default initializePassport;