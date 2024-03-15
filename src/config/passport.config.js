import passport from 'passport';
import passportJWT from 'passport-jwt';
import GithubStrategy from 'passport-github2';
import userModel from '../models/user.model.js';
import { UserManagerDB } from '../daos/DBManagers/UserManager/UserManagerDB.js';
import { config } from './config.js';

const CLIENT_ID = config.CLIENT_ID;
const CLIENT_SECRET = config.CLIENT_SECRET;
const CALLBACK_URL = config.CALLBACK_URL;
const JWT_SECRET_KEY = config.JWT_SECRET_KEY;

const userManager = new UserManagerDB();
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
        secretOrKey: JWT_SECRET_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        callbackURL: CALLBACK_URL
    }, async(accessToken, refreshToken, profile, done) => {
        console.log('profile', profile);
        try {
            let foundUser = await userModel.findOne({email: profile._json.email});
            console.log("user", foundUser);
            if(foundUser === null) {
                let user = await userManager.addUser({
                    first_name: profile._json.name,
                    last_name: profile._json.name,
                    email: profile._json.email,
                    password: ''
                });

                return done(null, user);
            }

            return done(null, foundUser);
        } catch (error) {
            return done(error);
        }
    }));
}

export default initializePassport;