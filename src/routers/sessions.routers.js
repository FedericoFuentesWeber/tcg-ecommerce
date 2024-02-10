import { Router } from "express";
import { UserManagerDB } from "../daos/DBManagers/UserManager/UserManagerDB.js";
import { 
    ADMIN_MAIL,
    ADMIN_PASSWORD,
    ADMIN_ROLE 
} from "../middleware/authentication.middleware.js";
import { createHash, isValidPassword } from "../../utils.js";
import passport from 'passport';

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

// router.post('/login', async(req, res) => {
//     try {
//         const { email, password } = req.body;

//         if(email == ADMIN_MAIL || password == ADMIN_PASSWORD) {
//             req.session.user = {
//                 id: "1",
//                 email: ADMIN_MAIL,
//                 role: ADMIN_ROLE
//             };

//             return res.status(200).send({
//                 status: "success",
//                 payload: "Login ok"
//             });
//         }

//         const user = await userManager.getUserByEmail( email);

//         if(!user) {
//             return res.send({
//                 status: "error",
//                 error: "No existe el usuario"
//             });
//         }

//         if(!isValidPassword(password, user.password)) {
//             return res.status(403).send({
//                 status: "failed",
//                 payload: "Invalid password"
//             })
//         }

//         req.session.user = {
//             id: user._id,
//             email: user.email,
//             role: "User"
//         };

//         res.status(200).send({
//             status: "success",
//             payload: "Login ok"
//         });
//     } catch (error) {
//         return res.status(400).send({
//             status: "failed",
//             payload: error.message
//         });
//     }
// });

// router.post('/register', async(req, res) => {
//     try {
//         const { first_name, last_name, email, password } = req.body;

//         if( first_name === '' || 
//             last_name === '' || 
//             email === '' || 
//             password === '') return res.send("Faltan datos obligatorios!!");

//         const user = await userManager.addUser({
//             first_name,
//             last_name,
//             email,
//             password: createHash(password)
//         });

//         res.status(200).send({
//             status: "success", 
//             payload: user
//         });
//     } catch (error) {
//         return res.status(400).send({
//             status: "failed",
//             payload: error.message
//         });
//     }
// });

router.post('/register', passport.authenticate('register', {failureRedirect: '/api/sessions/failregister'}), async(req, res) => {
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

router.post('/login', passport.authenticate('login', {failureRedirect: '/api/sessions/faillogin'}), async(req, res) => {
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
})

router.get('/faillogin', async(req, res) => {
    res.send({
        status: "failed",
        payload: "Failed login"
    });
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