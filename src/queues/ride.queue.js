const { Queue } = require("bullmq");

const connection = require("../config/bullmq");

const rideQueue = new Queue("ride-dispatch", {
    connection
});

module.exports = rideQueue;