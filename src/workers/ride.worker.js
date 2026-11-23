const { Worker } = require("bullmq");

const connection = require("../config/bullmq");

const {
    findNearbyDrivers
} = require("../modules/driver/driver.services");

const startRideWorker = (io) => {

    const worker = new Worker(
        "ride-dispatch",

        async (job) => {

            const {
                rideId,
                longitude,
                latitude
            } = job.data;

            console.log("Processing ride:", rideId);

            const drivers = await findNearbyDrivers(
                longitude,
                latitude,
                5,
                20
            );

            console.log("Nearby drivers:", drivers);

            // Send ride offer to drivers
            for (const driverId of drivers) {

                io.to(`driver:${driverId}`).emit(
                    "ride:offer",
                    {
                        rideId
                    }
                );
            }

            return {
                rideId,
                driversNotified: drivers.length
            };
        },

        {
            connection,
            concurrency: 5
        }
    );

    worker.on("completed", (job) => {
        console.log(`Job ${job.id} completed`);
    });

    worker.on("failed", (job, error) => {
        console.error(`Job ${job?.id} failed:`, error);
    });

    return worker;
};

module.exports = startRideWorker;