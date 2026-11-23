
const { redisClient } = require("../config/redis");

const GEO_KEY = "drivers:locations";
const AVAILABLE_KEY = "drivers:available";

const updateDriverLocation = async (driverId, longitude, latitude) => {

    // Validate coordinates
    if (
        !Number.isFinite(longitude) ||
        !Number.isFinite(latitude) ||
        longitude < -180 ||
        longitude > 180 ||
        latitude < -90 ||
        latitude > 90
    ) {
        throw new Error("Invalid coordinates");
    }

    // Store driver location in Redis GEO
    await redisClient.geoAdd(GEO_KEY, {
        longitude,
        latitude,
        member: driverId.toString()
    });

    // Track last location update (30 seconds TTL)
    await redisClient.set(
        `driver:lastSeen:${driverId}`,
        Date.now().toString(),
        { EX: 30 }
    );

    return true;
};


const setDriverAvailability = async (driverId, isAvailable) => {

    if (isAvailable) {
        await redisClient.sAdd(AVAILABLE_KEY, driverId.toString());
    } else {
        await redisClient.sRem(AVAILABLE_KEY, driverId.toString());
    }

    return true;
};


const findNearbyDrivers = async (
    longitude,
    latitude,
    radiusInKm = 5,
    limit = 20
) => {

    // Find nearby drivers using Redis GEO
    const nearbyDrivers = await redisClient.geoSearch(
        GEO_KEY,
        {
            longitude,
            latitude
        },
        {
            radius: radiusInKm,
            unit: "km"
        },
        {
            SORT: "ASC",
            COUNT: limit
        }
    );

    // Check availability and last location update
    const results = await Promise.all(
        nearbyDrivers.map(async (driverId) => {

            const [isAvailable, isOnline] = await Promise.all([
                redisClient.sIsMember(AVAILABLE_KEY, driverId),
                redisClient.exists(`driver:lastSeen:${driverId}`)
            ]);

            if (!isAvailable || !isOnline) {
                // Remove stale driver from GEO index
                if (!isOnline) {
                    await redisClient.zRem(GEO_KEY, driverId);
                }

                return null;
            }

            return driverId;
        })
    );

    return results.filter(Boolean);
};


module.exports = {
    updateDriverLocation,
    setDriverAvailability,
    findNearbyDrivers
};
