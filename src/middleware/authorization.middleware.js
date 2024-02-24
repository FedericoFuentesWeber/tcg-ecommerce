const authorization = (role) => {
    return async(req, res, next) => {
        if(!req.user) {
            return res.status(401).send({
                status: "failed",
                error: 'Unauthorized'
            });
        }

        if(req.user.role !== role) {
            return res.status(401).send({
                status: "failed",
                error: 'Role not valid'
            });
        }

        next();
    }
}

export { authorization }