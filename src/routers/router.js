import { Router } from "express";
import jwt from 'jsonwebtoken';
import { config } from "../config/config.js";


const JWT_SECRET_KEY = config.JWT_SECERET_KEY;

class RouterClass {
    constructor() {
        this.router = Router();
        this.init();
    }

    getRouter = () => {
        return this.router;
    }

    init() {

    }

    applyCallback(callbacks) {
        return callbacks.map(callback => async(...params) => {
            try {
                await callback.apply(this, params);               
            } catch (error) {
                console.log(error);
                params[1].status(500);
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSUccess = payload => res.send({
            status: "success",
            payload
        });
        res.sendServerError = error => res.send({satus: "error", error});
        res.sendUserError = error => res.send({status: "error", error});
    }

    handlePolicies = policies => (req, res, next) => {
        if(policies[0] === 'PUBLIC') next();
        //Por alguna razón el header the authorization no esta por lo que tengo que usar el de cookie
        // const authHeaders = req.headers.authorization;
        console.log(req.headers)
        const authHeaders = req.headers.cookie;
        const token = authHeaders.split('=')[1];
        let user = jwt.verify(token, JWT_SECRET_KEY);

        console.log("role", user.role.toUpperCase())
        if(!policies.includes(user.role.toUpperCase())) res.status(403).send({status: "error", error: "Role not valid"});
        req.user = user;
        next();
    }

    get(path, policies, ...callbacks){
        this.router.get(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks));
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks));
    }

    put(path, policies, ...callbacks){
        this.router.put(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks));
    }

    delete(path, policies, ...callbacks){
        this.router.delete(path, this.handlePolicies(policies), this.generateCustomResponses, this.applyCallback(callbacks));
    }

}

export { RouterClass }