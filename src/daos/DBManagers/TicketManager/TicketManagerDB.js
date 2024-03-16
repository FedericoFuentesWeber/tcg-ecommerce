import { Ticket } from "../../../main/Ticket/Ticket.js";
import ticketModel from "../models/ticket.model.js";

export class TicketManagerDB {
    
    createNewTicket = async({
        amount,
        purchaser
    }) => {
        return new Ticket({
            id: null,
            code: this.generateUniqueCode(),
            purchase_datetime: new Date(),
            amount,
            purchaser
        })
    }

    generateUniqueCode = async () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        
        const existingTicket = await ticketModel.findOne({ code });
        if (existingTicket) {
            return generateUniqueCode();
        }
        
        return code;
    }
    
    // assertCodeIsNotUsed = async(aCode) => {
    //     try {
    //         const codeId = (aTicket) => aTicket.code === aCode;
    //         let tickets = await this.getTickets();
    //         if(tickets.some(codeId)) {
    //             throw new Error(`El ticket con código ${aCode} ya existe.`);
    //         }
    //     } catch(error) {
    //         throw error;
    //     }
    // };

    addTicket = async(ticket) => {
        try {
            if(
                !ticket.amount ||
                !ticket.purchaser 
            ) {
                throw new Error("Hay parámetros sin completar.")
            }

            // await this.assertCodeIsNotUsed(ticket.code);
            const newTicket = await this.createNewTicket(ticket);

            ticketModel.create(newTicket);
        } catch(error) {
            console.error(error.message);
        }
    }

    getTickets = async() => {
        try {
            const tickets = await ticketModel.find({});
            const parsedTickets = tickets.map(
                (newTicket) => new Ticket(newTicket)
            );

            return parsedTickets;
        } catch (error) {
            console.error(error.message);
        }
    }
}