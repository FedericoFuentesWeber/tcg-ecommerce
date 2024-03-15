import { connect } from "mongoose";
import dotenv from 'dotenv';

dotenv.config();

const config = {
    PORT: process.env.PORT || 8080,
    DB_URL: process.env.DB_URL,
    JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
    CLIENT_ID: process.env.CLIENT_ID,
    CLIENT_SECRET: process.env.CLIENT_SECRET,
    CALLBACK_URL: process.env.CALLBACK_URL
};


const DB_URL = config.DB_URL;
    
const connectDB = async() => {
    try {
        await connect(DB_URL);
        console.log("Successfull DB connection");
    } catch(error) {
        console.log(error);
    }
};

export { connectDB, config };