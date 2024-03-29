import passport from 'passport';

const passportCall = (strategy) => {
    return async(req, res, next) => {
        passport.authenticate(strategy, function(error, user, info) {
            if(error) return next(error);
            if(!user) {
                return res.status(401).send({
                    status: "failed",
                    error: info.message ? info.message : info.toString()
                });
            }
            req.user = user;
            next();
        })(req, res, next)
    }
}

export { passportCall }