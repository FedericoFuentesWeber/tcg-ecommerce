function auth (req, res, next) {
    try {
        if( req.session?.user.email === "adminCoder@coder.com" && 
            req.session?.user.role === "Admin") return next();
    
    } catch (error) {
        return res.redirect("/login");
    }
}

export { auth };