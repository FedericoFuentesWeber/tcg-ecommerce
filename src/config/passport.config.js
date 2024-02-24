import passport from 'passport';
import passportJWT from 'passport-jwt';
import { PRIVATE_KEY } from '../../public/js/jsonwebtoken.js';

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