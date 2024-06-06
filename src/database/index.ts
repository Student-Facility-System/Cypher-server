import mongoose from 'mongoose';
import logger from "../logger/index.js";

const mongoDbUrl = process.env.MONGO_URI ||'mongodb://localhost:27017/';




export default async function connectDb() {
    try {
        await mongoose.connect(mongoDbUrl, {});
        console.log(`Connected to MongoDB at ${mongoDbUrl}`);
        logger.info(`Connected to MongoDB at ${mongoDbUrl}`);
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exitCode = 1; //     Exit with failure
    }
}