import { connect } from "mongoose";

const DB_URL = 
    'mongodb+srv://ffuentesweber:<password>@cluster0.ngmdz96.mongodb.net/tcg?retryWrites=true&w=majority';

const connectDB = async() => {
    try {
        await connect(DB_URL);
        console.log("Successfull DB connection");
    } catch(error) {
        console.log(error);
    }
};

export { connectDB };