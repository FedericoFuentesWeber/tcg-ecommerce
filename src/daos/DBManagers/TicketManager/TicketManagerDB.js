import { Ticket } from "../../../main/Ticket/Ticket.js";
import ticketModel from "../models/ticket.model.js";

export class TicketManagerDB {
    
    createNewTicket = async({
        amount,
        purchaser
    }) => {
        return new Ticket({
            id: null,
            code: await this.generateUniqueCode(),
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

    addTicket = async(amount, purchaser) => {
        try {
            if(
                !amount ||
                !purchaser 
            ) {
                throw new Error("Hay parámetros sin completar.")
            }

            const newTicket = await this.createNewTicket({amount, purchaser});

            return ticketModel.create(newTicket);
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