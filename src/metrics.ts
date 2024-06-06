import client from 'prom-client';

client.collectDefaultMetrics({register: client.register})

// Counter to count the total number of requests handled by the server
const totalRequestsCounter = new client.Counter({
    name: "total_req_count",
    help: "represents the total number of request handled by the server. (except /metrics) "});


// Histogram to measure the response time of each route
const restResponseHistogram = new client.Histogram({
    name: 'rest_express_response_time',
    help: 'Response time in ms for each route for the REST API Backend Server.',
    labelNames: ['method', 'route', 'statusCode'],
    buckets: [20, 50, 100, 500, 600, 800, 1000, 2000]
});


export default {
    totalRequestsCounter,
    restResponseHistogram,
};
