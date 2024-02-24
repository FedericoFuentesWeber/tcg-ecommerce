import express from "express";
import productRouter from "./routers/products.routers.js";
import cartRouter from "./routers/carts.routers.js";
import chatRouter from "./routers/chat.routers.js"
import productsViewRouter from "./routers/productsViews.routers.js";
import cartsViewRouter from "./routers/cartsViews.routers.js";
import sessionsRouter from "./routers/sessions.routers.js";
import loginViewRouter from "./routers/loginViews.routers.js";
import handlebars from 'express-handlebars';
import __dirname from '../utils.js';
import { Server as ServerIO } from 'socket.io';
import { DB_URL, connectDB } from "./config/config.js"
import messageModel from "./models/message.model.js";
import { MessageManagerDB } from "./daos/DBManagers/MessageManager/MessageManagerDB.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from 'passport';
import initializePassport from "./config/passport.config.js";

const messageManager = new MessageManagerDB();

const app = express();
const PORT = process.env.PORT || 8080;
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname+'/public'));
app.use(cookieParser());
// app.use(session({
//     store: MongoStore.create({
//         mongoUrl: DB_URL,
//         mongoOptions: {
//             useNewUrlParser: true,
//             useUnifiedTopology: true
//         },
//         ttl: 15
//     }),
//     secret: 'sessionSecret',
//     resave: true,
//     saveUninitialized: true
// }));
initializePassport();
app.use(passport.initialize());
// app.use(passport.session());

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

app.use("/", loginViewRouter);
app.use("/", productsViewRouter);
app.use("/carts", cartsViewRouter);
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);

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