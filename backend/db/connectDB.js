import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

const connectDB = async () => {
    try {
        await mongoose.connect(DATABASE_URL);
        console.log("connected to database");
    }
    catch (err){
        console.error(`Error: ${err}`);
        process.exit(1);
    }
}

export default connectDB