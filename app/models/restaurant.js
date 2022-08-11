const mongoose = require("mongoose")
const Schema = mongoose.Schema


const restaurantSchema = new Schema({
    name: {
        type: String,
        minlengt: 3,
        maxlength: 256,
        required: [true, "name must be provided"],
        trim: true
    },
    mealSessions: {
        Breakfast: {
            accepting: {
                type: Boolean,
                required: true
            },
            start: {
                type: String,
                trim: true,
                required: true
            },
            end: {
                type: String,
                trim: true,
                required: true
            }
        },
        Lunch: {
            accepting: {
                type: Boolean,
                required: true
            },
            start: {
                type: String,
                trim: true,
                required: true
            },
            end: {
                type: String,
                trim: true,
                required: true
            }
        },
        Dinner: {
            accepting: {
                type: Boolean,
                required: true
            },
            start: {
                type: String,
                trim: true,
                required: true
            },
            end: {
                type: String,
                trim: true,
                required: true
            }
        },
    },
    allowedTimeMargin: {
        type: Number,
        min: 1,
        max: 8,
        required: true
    },

    address: {
        number: {
            type: String,
            required: [true, "building/flat number is required"],
            munlength: 1,
            maxlength: 12,
            trim: true
        },
        street: {
            type: String,
            required: [true, "street details must be provided"],
            minlength: 3,
            maxlength: 128,
            trim: true
        },
        area: {
            type: String,
            required: [true, "area details must be provided"],
            minlength: 3,
            maxlength: 128,
            trim: true
        },
        pincode: {
            type: Number,
            required: [true, "city name must be provided"],
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
        },

        location: {
            type: {
                type: String,
                enum: ['Point'],
                required: true,
                default: "Point"
            },
            coordinates: {
                type: [Number],
                index: "2dsphere",
                required: true
            }
        }
    },
    userRef: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

const Restaurant = mongoose.model("Restaurant", restaurantSchema)

module.exports = Restaurant