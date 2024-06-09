// logger.ts

import TransportStream from 'winston-transport';
import winston, { LogEntry } from 'winston';
import pg from 'pg'; // Import Pool from pg

interface PostgresTransportOptions extends TransportStream.TransportStreamOptions {
    poolConfig: pg.PoolConfig; // Update option to use PoolConfig
    tableName: string;
}

class PostgresTransport extends TransportStream {
    pool: pg.Pool; // Change client to pool
    tableName: string;

    constructor(opts: PostgresTransportOptions) {
        super(opts);
        this.pool = new pg.Pool(opts.poolConfig); // Create a pool using PoolConfig
        this.tableName = opts.tableName;
    }

    log(info: LogEntry, callback: () => void) {
        setImmediate(() => this.emit('logged', info));

        const { level, message, ...meta } = info;
        const text = `INSERT INTO ${this.tableName} (level, message, meta) VALUES($1, $2, $3)`;
        const values = [level, message, JSON.stringify(meta)];

        // Acquire a client from the pool and perform the database write operation
        this.pool.connect((err, client, release) => {
            if (err) {
                console.error('Error acquiring client from pool', err);
                callback(); // Call the callback to indicate that the logging operation is complete
                return;
            }

            if (!client) {
                console.error('Error acquiring client from pool');
                callback(); // Call the callback to indicate that the logging operation is complete
                return;
            }

            client.query(text, values, (err) => {
                release(); // Release the client back to the pool
                if (err) {
                    console.error('Error logging to PostgresSQL', err);
                }
                callback(); // Call the callback to indicate that the logging operation is complete
            });
        });
    }
}

// Configure PostgresSQL transport with connection pool config
const postgresTransport = new PostgresTransport({
    poolConfig: {
        user: process.env.POSTGRES_USER as string,
        host: process.env.POSTGRES_HOST as string,
        database: process.env.POSTGRES_DB as string,
        password: process.env.POSTGRES_PASSWORD as string,
        port: Number(process.env.POSTGRES_PORT as string),
        max: 20, // Maximum number of clients in the pool
        idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
        connectionTimeoutMillis: 2000, // Wait for a client to become available before timing out (2 seconds)
    },
    tableName: 'logs'            // Table where logs will be stored
});

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Set the log level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamps to logs
        winston.format.json()       // Format logs as JSON
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        postgresTransport                 // Log to PostgresSQL
    ]
});

// Export the logger instance
export default logger;
