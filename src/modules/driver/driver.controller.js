
const {
    updateDriverLocation,
    setDriverAvailability,
    findNearbyDrivers
} = require("../services/driver.services");

const updateLocation = async (req, res) => {
    try {
        const { driverId, longitude, latitude } = req.body;

        await updateDriverLocation(
            driverId,
            Number(longitude),
            Number(latitude)
        );

        res.status(200).json({
            success: true,
            message: "Driver location updated"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const updateAvailability = async (req, res) => {
    try {
        const { driverId, isAvailable } = req.body;

        await setDriverAvailability(driverId, isAvailable);

        res.status(200).json({
            success: true,
            message: "Availability updated"
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};


const getNearbyDrivers = async (req, res) => {
    try {
        const { longitude, latitude } = req.query;

        const drivers = await findNearbyDrivers(
            Number(longitude),
            Number(latitude),
            5,
            20
        );

        res.status(200).json({
            success: true,
            count: drivers.length,
            drivers
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    updateLocation,
    updateAvailability,
    getNearbyDrivers
};
