import { Router } from "express";
import { auth } from "../middleware/authentication.middleware.js";
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

router.post('/login', auth, async(req, res) => {
    try {
        const { email, password } = req.body;

        const foundUser = await userManager.getUserByInformation({ email, password });

        if(!foundUser) {
            return res.send({
                status: "error",
                error: "No existe el usuario"
            });
        }

        req.session.user = {
            id: user.id,
            username: user.first_name,
            role: user.role
        };

        res.status(200).send({
            status: "success",
            payload: foundUser
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
            password
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
        if(error) res.send('Logout error');
    });

    res.status(200).redirect("/login");
});

router.get('/current', auth, async(req, res) => {
    res.send("Datos sensibles");
})

export default router;