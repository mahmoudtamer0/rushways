const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    licenseNumber: {
        type: String,
        required: true,
    },

    verificationStatus: {
        type: String,
        required: true,
        default: "pending"
    },

    isAvailable: {
        type: Boolean,
        default: false,
    },

    rating: {
        type: Number,
        default: 5.0
    },

    totalTrips: {
        type: Number,
        default: 0
    },


}, { timestamps: true })
module.exports = mongoose.model("Driver", driverSchema);