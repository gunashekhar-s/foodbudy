const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uniqueValidator = require("mongoose-unique-validator")

const subscriptionPlanSchema = new Schema({
    title: {
        type: String,
        required: [true, "plan title is requried"],
        minlength: 3,
        maxlength: 256,
        trim: true,
        unique: true
    },
    description: {
        type: String,
        required: [true, "description cannot be empty"],
        minlength: 8,
        maxlength: 256
    },
    days: {
        type: Number,
        required: true,
        min: 1,
        max: 30
    },
    totalPrice: {
        type: Number,
        required: [true, "total price cannot be empty"]
    },
    pricePerDay: {
        type: Number,
        requred: [true, "price per day cannot be empty"]
    },
    status: {
        type: Boolean,
        required: [true, "status boolean value must be provided"],
        default: true
    }
}, { collation: { locale: 'en_US', strength: 2 }, timestamps: true })


subscriptionPlanSchema.plugin(uniqueValidator);





const SubscriptionPlan = mongoose.model("SubscriptionPlan", subscriptionPlanSchema)

module.exports = SubscriptionPlan