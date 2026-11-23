const Ride = require("./ride.schema")
const rideQueue = require("../queues/ride.queue");

const createRide = async (customerId, data) => {

    const ride = await Ride.create({
        customerId,
        pickup: data.pickup,
        destination: data.destination,

        fare: {
            estimated: 120
        },

        paymentMethod: data.paymentMethod,
        status: "searching"
    });

    await rideQueue.add(
        "find-nearby-drivers",
        {
            rideId: ride._id.toString(),

            longitude: data.pickup.location.coordinates[0],

            latitude: data.pickup.location.coordinates[1]
        },
        {
            jobId: `dispatch-${ride._id}`
        }
    );

    return ride;
};

module.exports = {
    createRide
};