import { Router } from "express";
import { sendEmail } from "../utils/email.js";

const router = Router();

router.get('/mail', (req, res) => {
    const { receiver } = req.body;
    const subject = "Reestablecer contraseña";
    const html = `<div><h1>Email para reestablecer contraseña</h1></div>`;

    sendEmail(receiver, subject, html);

    res.send("Mail enviado");
});

export default router;