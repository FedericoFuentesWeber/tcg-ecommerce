import { Router } from "express";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";
import { 
    ADMIN_MAIL,
    ADMIN_PASSWORD,
    ADMIN_ROLE 
} from "../middleware/authentication.middleware.js";
import { createHash, isValidPassword } from "../../utils.js";

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

router.post('/login', async(req, res) => {
    try {
        const { email, password } = req.body;

        if(email == ADMIN_MAIL || password == ADMIN_PASSWORD) {
            req.session.user = {
                id: "1",
                email: ADMIN_MAIL,
                role: ADMIN_ROLE
            };

            return res.status(200).send({
                status: "success",
                payload: "Login ok"
            });
        }

        // const user = await userManager.getUserByInformation( email, password );
        const user = await userManager.getUserByEmail( email);

        if(!user) {
            return res.send({
                status: "error",
                error: "No existe el usuario"
            });
        }

        if(!isValidPassword(password, user.password)) {
            return res.status(403).send({
                status: "failed",
                payload: "Invalid password"
            })
        }

        req.session.user = {
            id: user._id,
            email: user.email,
            role: "User"
        };

        res.status(200).send({
            status: "success",
            payload: "Login ok"
        });
    } catch (error) {
        return res.status(400).send({
            status: "failed",
            payload: error.message
        });
    }
});

router.post('/register', async(req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if( first_name === '' || 
            last_name === '' || 
            email === '' || 
            password === '') return res.send("Faltan datos obligatorios!!");

        const user = await userManager.addUser({
            first_name,
            last_name,
            email,
            password: createHash(password)
        });

        res.status(200).send({
            status: "success", 
            payload: user
        });
    } catch (error) {
        return res.status(400).send({
            status: "failed",
            payload: error.message
        });
    }
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

export default router;