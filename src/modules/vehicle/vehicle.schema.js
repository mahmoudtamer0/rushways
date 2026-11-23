
const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
    driverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Driver",
        required: true
    },

    brand: {
        type: String,
        required: true,
        trim: true
    },

    model: {
        type: String,
        required: true,
        trim: true
    },

    year: {
        type: Number,
        required: true,
        min: 1990
    },

    color: {
        type: String,
        required: true,
        trim: true
    },

    plateNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        uppercase: true
    },

    category: {
        type: String,
        enum: ["economy", "comfort", "business"],
        required: true
    },

    seats: {
        type: Number,
        required: true,
        min: 1
    },

    isActive: {
        type: Boolean,
        default: true
    },

    verificationStatus: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },

}, { timestamps: true });

vehicleSchema.index({ driverId: 1 });
vehicleSchema.index({ category: 1, isActive: 1 });

module.exports = mongoose.model("Vehicle", vehicleSchema);
