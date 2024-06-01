import express from "express";
import handlebars from 'express-handlebars';
import __dirname from '../utils.js';
import { Server as ServerIO } from 'socket.io';
import { config, connectDB } from "./config/config.js"
import messageModel from "../src/daos/DBManagers/models/message.model.js";
import { MessageManagerDB } from "./daos/DBManagers/MessageManager/MessageManagerDB.js";
import cookieParser from "cookie-parser";
import passport from 'passport';
import initializePassport from "./config/passport.config.js";
import { ProductsViews } from "./routers/productsViewClass.routers.js";
import appRouter from "./routers/index.js";
import { errorHandler } from "./middleware/errors/index.js";
import { addLogger } from "./utils/logger.js";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from 'swagger-ui-express';

const messageManager = new MessageManagerDB();
const productsViews = new ProductsViews();

const app = express();
const PORT = config.PORT;
connectDB();

const swaggerOptions = {
    definition: {
        openapi:'3.0.1',
        info: {
            title:"Documentación de TCG e-commerce",
            description:"API pensada para el proyecto de backend de Coderhouse"
        }
    },
    apis:[`${__dirname}/src/docs/**/*.yaml`]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

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
    },
    hasAdminRole: (role) => {
        return role == "ADMIN";       
    }
}}));

app.set('view engine', 'hbs');
app.set('views', __dirname+'/views');

app.use(addLogger);
app.use(appRouter);
app.use(errorHandler);

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