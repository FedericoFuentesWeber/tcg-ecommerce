import { UserDto } from "../dtos/userDto.js";
import { sessionService } from "../repositories/index.js";
import { createHash, isValidPassword } from "../utils/bcrypt.js";
import { genertateToken } from "../utils/jsonwebtoken.js";

class SessionController {
    constructor() {
        this.service = sessionService;
    }

    login = async(req, res) => {
        const { email, password } = req.body;
    
        const user = await this.service.login(email);
    
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
    };

    register = async(req, res) => {
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
            throw error;
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
        //TODO: send a DTO of user
        // const { user } = req.body;
        // console.log("usuario actual", user);
        // const userDto = new UserDto(user);
        // console.log(userDto);
        res.send({
            message:"Datos sensibles"
        });
    }
}

export { SessionController }