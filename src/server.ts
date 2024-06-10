import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MongooseError } from 'mongoose';
import { FirebaseError } from 'firebase/app';
import connectDb from "./database/index.js";
import logger from './lib/logger.js';


// ROUTES
import student from "./routes/v1/student/index.js";
import partner from "./routes/v1/partner/index.js";

// CONSTANTS
const PORT: number = Number(process.env.PORT) || 8080;

// APP
const app = express();

// MIDDLEWARES
app.use(cors({ origin: '*' })); // allow all origins

// Middleware to parse JSON and URL-encoded request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware to handle multipart/form-data
// Logging middleware
app.use(async(req, res, next) => {
     logger.log('info', `${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.headers['user-agent'],
        body: req.body,
        params: req.params,
        query: req.query,
    });
    console.log('logged.')
    next();
});

// Routes
app.use('/api/v1/student', student);
app.use('/api/v1/partner', partner);

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

    res.status(500).send({
        message: 'Internal server error',
        errors: [{ name: err.name, message: err.message}],
    });

    next();
}
app.use(errorHandler);

// SERVER FUNCTIONS
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
