import { connect } from "mongoose";

DB_URL = 
    'mongodb+srv://ffuentesweber:Ma3n9KcZFtY07D5p@cluster0.ngmdz96.mongodb.net/tcg?retryWrites=true&w=majority'

const connectDB = async() => {
    try {
        await connect(DB_URL);
        console.log("Successfull DB connection");
    } catch(error) {
        console.log(error);
    }
}