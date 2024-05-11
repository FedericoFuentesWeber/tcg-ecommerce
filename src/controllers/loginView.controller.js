class LoginViewController {
    
    login = async(req, res) => {
        try {
            res.status(200).render("login");
        } catch (error) {
            return res.status(400).render("login", {
                title: "Login",
                errorMessage: error.message
            });
        }
    };

    register = async(req, res) => {
        try {
            res.status(200).render("register");
        } catch (error) {
            return res.status(400).render("register", {
                title: "Register",
                errorMessage: error.message
            });
        }
    };

    recoverPassword = async(req, res) => {
        try {
            res.status(200).render("recoverPassword");
        } catch (error) {
            return res.status(400).render("recoverPassword", {
                title: "Recover Password",
                errorMessage: error.message
            })
        }
    };

    changePassword = async(req, res) => {
        try {
            res.status(200).render("changePassword");
        } catch (error) {
            return res.status(400).render("changePassword", {
                title: "Recover Password",
                errorMessage: error.message
            })
        }
    };
}

export { LoginViewController }