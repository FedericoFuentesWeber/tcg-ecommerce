import nodemailer from 'nodemailer';
import { config } from "../config/config.js";
import __dirname from "../../utils.js";

const GMAIL_USER = config.GMAIL_USER;
const GMAIL_PASS = config.GMAIL_PASS;

const transport = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: GMAIL_USER,
        pass: GMAIL_PASS
    }
})

const sendEmail =  async(receiver, subject, html) => {
    await transport.sendMail({
        from: `Coder Tests <${GMAIL_USER}>`,
        to: receiver,
        subject: subject,
        html: html,
        attachments: [{
            filename: 'dragonair.jpg',
            path: __dirname+'/public/images/dragonair.jpg',
            cid: 'dragonair'
        }]
    });
    
};

export { sendEmail };