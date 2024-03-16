import { Router } from "express";
import nodemailer from 'nodemailer';
import { config } from "../config/config.js";

const GMAIL_USER = config.GMAIL_USER;
const GMAIL_PASS = config.GMAIL_PASS;

const router = Router();
const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
})

router.get('/mail', async(req, res) => {
    try {
        let result = await transport.sendMail({
                from: `Coder Tests <${GMAIL_USER}>`,
                to: 'ffuentesweber@gmail.com',
                subject: 'Correo de prueba coder',
                html: `<div><h1>Estó es un test</h1></div>`,
                attachments: []
        })
    } catch (error) {
        return res.status(400).send({
            status: "failed",
            payload: error.message
        });
    }
});

export default router;