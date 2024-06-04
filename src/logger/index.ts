import {createLogger, transports} from "winston";
import LokiTransport from "winston-loki";
const options = {

    transports: [
        new LokiTransport({
            host: "http://127.0.0.1:3100"
        })
    ]

};
const logger = createLogger(options);

export default logger;
