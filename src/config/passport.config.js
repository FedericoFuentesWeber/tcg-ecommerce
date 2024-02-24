import passport from 'passport';
import passportJWT from 'passport-jwt';
import { PRIVATE_KEY } from '../../public/js/jsonwebtoken.js';
import GithubStrategy from 'passport-github2';
import userModel from '../models/user.model.js';
import { UserManagerDB } from '../daos/DBManagers/UserManager/UserManagerDB.js';

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
        secretOrKey: PRIVATE_KEY
    }, async(jwt_payload, done) => {
        try {
            return done(null, jwt_payload);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('github', new GithubStrategy({
        clientID: 'Iv1.ec6d76754baf8cd7',
        clientSecret: 'f74b24c52d60aaa66a3dfe703f88e4c8f7fbcb66',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback'
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