import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { MongooseError } from 'mongoose';
import { FirebaseError } from 'firebase/app';

// METRICS IMPORT
import metrics from "./metrics.js";
import responseTime from 'response-time';
import client from 'prom-client'

// ROUTES
import student from "./routes/api/v1/student/index.js";


// ! CONSTANTS
const PORT:number = Number(process.env.PORT) || 3001;

// ! APP
const app = express();


// ! MIDDLEWARES
app.use(cors({ origin: '*' })); // allow all origins
app.use(express.json());
app.use(responseTime((request:Request, response:Response, time:number) => {
    if (request?.route?.path) {
        const route = request.route.path;
        const method = request.method;
        const statusCode = response.statusCode;

        if (route !== '/metrics') metrics.totalRequestsCounter.inc(1); // increment the total request counter except for /metrics route.
        metrics.restResponseHistogram.observe({ method, route, statusCode }, time * 1000); // convert time to ms.
    }
}));


// ! ROUTES

app.use('/api/v1/student', student);




// ! METRIC ROUTE
client.collectDefaultMetrics({register: client.register
});
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

    res.status(500).send({
        message: 'Internal server error',
        errors: [{ name: err.name, message: err.message}],
    });
}
app.use(errorHandler);



// ! SERVER FUNCTIONS
const startServer = async function() {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};

await startServer();
