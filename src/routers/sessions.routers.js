import { Router } from "express";
import passport from 'passport';
// import { genertateToken } from "../../public/js/jsonwebtoken.js";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";
import { passportCall } from "../middleware/passportCall.middleware.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { genertateToken } from "../utils/jsonwebtoken.js";

const router = Router();
const userManager = new UserManagerDB();

router.get('/github', passport.authenticate('github', {scope:['user: email']}), async(req, res) => {});
router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/login'}), async(req, res) => {
    req.session.user = req.user;
    res.redirect('/products');
});

router.get('/logout', async(req, res) => {

    try {
        return res.status(200).send({
            status: "success",
            payload: "Logout done"
        });
    } catch (error) {
        return res.status(400).send({
            status: "failed",
            payload: error.message
        });
    }
});


//JWT
router.post('/login', async(req, res) => {
    const { email, password } = req.body;

    const user = await userManager.getUserByEmail(email);

    if(!isValidPassword(password, user.password)){
        return res.status(401).send({
            status: 'failed',
            payload: "No coincide las credenciales"
        });
    }

    const token = genertateToken({
        fullname: `${user.first_name} ${user.last_name}`,
        role: user.role,
        email: user.email,
        cartId: user.cartId._id
    });

    res.status(200).cookie('cookieToken', token, {
        maxAge: 60*60*1000*24,
        httpOnly: true
    }).send({
        status: "success",
        usersCreate: "Login success"
    });
});

router.post('/register', async(req, res) => {
    const { first_name, last_name, age, email, password } = req.body;

    try {
        const result = await userManager.addUser({
            first_name,
            last_name,
            age,
            email,
            password: createHash(password)
        });
    
        res.status(200).send({
            status: "success",
            usersCreate: result
        });    
    } catch (error) {
        throw error;
    }
    
});

router.get('/current', passportCall('jwt'), authorization("USER"), async(req, res) => {
    res.send({
        message:"Datos sensibles"
    });
});

export default router;