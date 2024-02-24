import { Router } from "express";
import { 
    ADMIN_MAIL,
    ADMIN_PASSWORD,
    ADMIN_ROLE 
} from "../middleware/authentication.middleware.js";
import passport from 'passport';
import { genertateToken, authTokenMiddleware } from "../../public/js/jsonwebtoken.js";
import userModel from "../models/user.model.js";
import { createHash, isValidPassword } from "../../utils.js";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";

const router = Router();
const userManager = new UserManagerDB();

router.get('/session', async(req, res) => {
    if (req.session.counter) {
        req.session.counter++;
        req.send(`Ya visito la página ${req.session.counter} veces.`);
    } else {
        req.session.counter = 1;
        res.send('Bienvenido a TCG');
    }
});

router.post('/registerPassport', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async(req, res) => {
    res.send({
        status: "success",
        payload: "User registered"
    });
});

router.get('/failregister', async(req, res) => {
    res.send({
        status: "failed",
        payload: "Failed registration"
    })
});

router.post('/loginPassport', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async(req, res) => {
    if(!req.user) {
        return res.status(400).send({
            status: "failed",
            payload: "Invalid credentials"
        });
    }

    if(req.user.email == ADMIN_MAIL && req.user.password == ADMIN_PASSWORD) {
        req.session.user = {
            id: "1",
            email: ADMIN_MAIL,
            role: ADMIN_ROLE,
            first_name: req.user.first_name,
            last_name: req.user.last_name
        };
        return res.status(200).send({
            status: "success",
            payload: "Login ok"
        });
    }

    req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        email: req.user.email,
        id: req.user._id,
        role: "User"
    };

    res.send({
        status: "success",
        payload: req.user
    });
});

router.get('/faillogin', async(req, res) => {
    res.send({
        status: "failed",
        payload: "Failed login"
    });
});

router.get('/github', passport.authenticate('github', {scope:['user: email']}), async(req, res) => {});
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/logout', async(req, res) => {
    req.session.destroy(error => {
        if(error){
            return res.status(400).send({
                status: "failed",
                payload: error.message
            });
        }

        return res.status(200).send({
            status: "success",
            payload: "Logout done"
        });
    });
});


//JWT
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    // const user = await userModel.findOne({ email });
    const user = await userManager.getUserByEmail(email);

    if(!isValidPassword(password, user.password)){
        return res.status(401).send({
            status: 'failed',
            payload: "No coincide las credenciales"
        });
    }

    const token = genertateToken({
        fullname: `${user.first_name} ${user.last_name}`,
        id: user._id,
        email: user.email
    });

    res.status(200).send({
        status: "success",
        usersCreate: "Login success",
        token
    });
});

router.post('/register', async(req, res) => {
    const { first_name, last_name, email, password } = req.body;

    const result = await userManager.addUser({
        first_name,
        last_name,
        email,
        password: createHash(password)
    });

    const token = genertateToken({
        id: result._id
    });

    res.status(200).send({
        status: "success",
        usersCreate: result,
        token
    });
});

router.get('/current', async(req, res) => {
    res.send("Datos sensibles");
});

export default router;