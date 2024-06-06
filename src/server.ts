import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MongooseError } from 'mongoose';
import { FirebaseError } from 'firebase/app';
import connectDb from "./database/index.js";

// METRICS IMPORT
import metrics from "./metrics.js";
import responseTime from 'response-time';
import client from 'prom-client'

// ROUTES
import student from "./routes/api/v1/student/index.js";
import {MulterError} from "multer";
import logger from "./logger/index.js";


// ! CONSTANTS
const PORT:number = Number(process.env.PORT) || 8080;
const register = new client.Registry();


// ! APP
const app = express();


// ! MIDDLEWARES
app.use(cors({ origin: '*' })); // allow all origins
app.use(express.json());
app.use(
    responseTime((request:Request, response:Response, time:number) => {
    if (request.path !== '/metrics')
        metrics.restResponseHistogram.labels({
            method: request.method,
            route: request.path,
            statusCode: response.statusCode,
        }).observe(time);
        metrics.totalRequestsCounter.inc(1);
}));


// ! ROUTES

app.use('/api/v1/student', student);



// ! METRIC ROUTE
client.collectDefaultMetrics({register:register});
app.get('/metrics', async (req:Request, res:Response) => {
    res.set('Content-Type', client.register.contentType);
    return res.send(await client.register.metrics());
})


// ! ERROR HANDLING
// Error handling middleware
function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
    if (!err) return;
    console.error(new Date(), err);

    if (err instanceof MongooseError) {
        res.status(500).send({
            message: 'Internal server error',
            errors: [{ name: err.name, message: err.message}],
        });
        return
    }

    if (err instanceof FirebaseError) {
        res.status(500).send({
            message: 'Internal server error',
            errors: [{
                name: err.name,
                message: err.message,
                code: err.code,
                customData: err.customData,
            }],
        });
        return
    }

    if (err instanceof MulterError) {
        res.status(400).send({
            message: 'Bad request',
            errors: [{...err}],
        });
        return
    }

    res.status(500).send({
        message: 'Internal server error',
        errors: [{ name: err.name, message: err.message}],
    });
}
app.use(errorHandler);



// ! SERVER FUNCTIONS
const startServer = async function() {
    try {
        await connectDb();
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (e) {
        console.error('Error starting server:', e);
        process.exitCode = 1; // Exit with failure
    }


};

await startServer();
