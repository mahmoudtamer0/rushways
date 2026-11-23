
const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({

    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        default: null
    },

    vehicleId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vehicle",
        default: null
    },

    status: {
        type: String,
        enum: [
            "searching",
            "accepted",
            "arrived",
            "in_progress",
            "completed",
            "cancelled"
        ],
        default: "searching"
    },

    pickup: {
        address: {
            type: String,
            required: true
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                required: true
            }
        }
    },

    destination: {
        address: {
            type: String,
            required: true
        },

        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point"
            },

            coordinates: {
                type: [Number],
                required: true
            }
        }
    },

    fare: {
        estimated: {
            type: Number,
            required: true,
            min: 0
        },

        final: {
            type: Number,
            default: null,
            min: 0
        },

        currency: {
            type: String,
            default: "EGP"
        }
    },

    paymentMethod: {
        type: String,
        enum: ["cash", "wallet", "card"],
        required: true
    },

    paymentStatus: {
        type: String,
        enum: ["pending", "paid", "failed", "refunded"],
        default: "pending"
    },

    cancellation: {
        cancelledBy: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },

        reason: {
            type: String,
            default: null
        },

        cancelledAt: {
            type: Date,
            default: null
        }
    },

    requestedAt: {
        type: Date,
        default: Date.now
    },

    acceptedAt: {
        type: Date,
        default: null
    },

    arrivedAt: {
        type: Date,
        default: null
    },

    startedAt: {
        type: Date,
        default: null
    },

    completedAt: {
        type: Date,
        default: null
    },

}, { timestamps: true });


rideSchema.index({ customerId: 1, createdAt: -1 });

rideSchema.index({ driverId: 1, createdAt: -1 });

rideSchema.index({ status: 1, createdAt: -1 });

rideSchema.index({
    "pickup.location": "2dsphere"
});

rideSchema.index({
    "destination.location": "2dsphere"
});

module.exports = mongoose.model("Ride", rideSchema);
