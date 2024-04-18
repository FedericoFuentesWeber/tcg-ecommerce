import { UserDto } from "../dtos/userDto.js";
import { sessionService } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { sendEmail } from "../utils/email.js";
import { genertateToken, generateTokenWith } from "../utils/jsonwebtoken.js";
import { createEmailWith } from "../utils/passwordRecoveryEmail.js";

class SessionController {
    constructor() {
        this.service = sessionService;
    }

    login = async(req, res) => {
        const { email, password } = req.body;
    
        const user = await this.service.getUserByEmail(email);
    
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
            cartId: user.cartId._id,
            id: user._id
        });
        res.status(200).cookie('cookieToken', token, {
            maxAge: 60*60*1000*24,
            httpOnly: true
        }).send({
            status: "success",
            usersCreate: "Login success"
        });
    };

    register = async(req, res, next) => {
        const { first_name, last_name, age, email, password } = req.body;
        try {
            const result = await this.service.register({
                first_name,
                last_name,
                age,
                email,
                password: createHash(password)
            });
        
            const token = genertateToken({
                id: result._id
            })

            res.status(200).cookie('cookieToken', token, {
                maxAge: 60*60*1000*24,
                httpOnly: true
            }).send({
                status: "success",
                usersCreate: result
            });    
        } catch (error) {
            next(error);
        }
        
    };

    logout = async(req, res) => {

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
    };

    current = async(req, res) => {
        const user = await this.service.getUserByEmail(req.user.email);
        res.send({
            status: "success",
            payload: new UserDto({
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                age: user.age,
                role: user.role,
                id: user._id
            })
        });
    };

    recoverPassword = async(req, res, next) => {
        const { email } = req.body;

        try {
            const user = await this.service.getUserByEmail(email);
            const token = generateTokenWith(
                {
                    id: user._id,
                    email: user.email
                },
                '1h'
            );

            const emailBody = createEmailWith(token);

            sendEmail(
                email,
                "Solicitud de cambio de contraseña - TCG", 
                emailBody
            );

            return res.status(200).send({
                status: "success",
                payload: "Recover password email sent"
            });
        } catch (error) {
            next(error);
        }
    };

    changePassword = async(req, res, next) => {
        const { email, password } = req.body;

        try {
            const user = await this.service.getUserByEmail(email);

            if(isValidPassword(password, user.password)) {
                return res.status(401).send({
                    status: "failed",
                    payload: "New password can't be the same as the last one"
                });
            }

            await this.service.changePasswordFor(user, createHash(password));

            return res.status(200).send({
                status: "success",
                payload: "Password changed"
            })
        } catch (error) {
            next(error);
        }
    };
}

export { SessionController }