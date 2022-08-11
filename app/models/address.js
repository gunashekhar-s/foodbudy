const mongoose = require("mongoose")
const Schema = mongoose.Schema

const addressSchema = new Schema({

    userRef: {
        type: Schema.Types.ObjectId,
        required: true
    },
    houseNumber: {
        type: String,
        required: [true, "House Number is required"],
        minlength: 1,
        maxlength: 24
    },
    streetName: {
        type: String,
        required: [true, "street details is required"],
        munlength: 8,
        maxlength: 128,
        trim: true
    },
    areaName: {
        type: String,
        required: [true, "area details must be provided"],
        minlength: 3,
        maxlength: 128,
        trim: true
    },
    pincode: {
        type: Number,
        required: [true, "pincode name must be provided"],
        minlength: 6,
        maxlength: 6,
        trim: true
    },
    city: {
        type: String,
        required: [true, "city name must be provided"],
        minlength: 3,
        maxlength: 128,
        trim: true
    },
    state: {
        type: String,
        required: [true, "state name must be provided"],
        minlength: 3,
        maxlength: 128,
        trim: true
    }

}, { timestamps: true })



const Address = mongoose.model("Address", addressSchema)


module.exports = Address