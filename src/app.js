import express from "express";
import productRouter from "./routers/products.routers.js";
import cartRouter from "./routers/carts.routers.js";
import chatRouter from "./routers/chat.routers.js"
// import productsViewRouter from "./routers/productsViews.routers.js";
import cartsViewRouter from "./routers/cartsViews.routers.js";
import sessionsRouter from "./routers/sessions.routers.js";
import loginViewRouter from "./routers/loginViews.routers.js";
import handlebars from 'express-handlebars';
import __dirname from '../utils.js';
import { Server as ServerIO } from 'socket.io';
import { connectDB } from "./config/config.js"
import messageModel from "./models/message.model.js";
import { MessageManagerDB } from "./daos/DBManagers/MessageManager/MessageManagerDB.js";
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from "./config/passport.config.js";
import { ProductsViews } from "./routers/productsViewClass.routers.js";
import appRouter from "./routers/index.js";

const messageManager = new MessageManagerDB();
const productsViews = new ProductsViews();

const app = express();
const PORT = process.env.PORT || 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
initializePassport();
app.use(passport.initialize());

app.engine('hbs', handlebars.engine({
    extname: ".hbs",
    helpers: {
    json: (anObject) => {
        if(anObject == "") {
            return [];
        } else {
            return JSON.stringify(anObject);
        }
    }
}}));

app.set('view engine', 'hbs');
app.set('views', __dirname+'/views');

app.use(appRouter);

const httpServer = app.listen(PORT, () => {
    console.log(`Escuchando en el puerto ${PORT}`)
})

const io = new ServerIO(httpServer);

io.on('connection', socket => {
    console.log('Client connected');

    socket.on("addMessageEvent", async (data) => {
        messageModel.create(data);
    
        const messages = await messageManager.getMessages();
    
        io.emit("updateMessages", messages);
      });
});

export { io };