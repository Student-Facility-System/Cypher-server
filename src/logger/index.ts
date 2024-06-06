import {createLogger, transports} from "winston";
import LokiTransport from "winston-loki";
const options = {

    transports: [
        new LokiTransport({
            host: "http://192.168.1.8:3100"
        })
    ]

};
const logger = createLogger(options);

export default logger;
