const mongoose = require("mongoose")
const Schema = mongoose.Schema

const orderSchema = new Schema({

    userRef: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId is required"]
    },
    subscriptionRef: {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
        required: [true, "subscriptionId is required"]
    },
    deliveryDate: {
        type: Date,
        required: [true, "delivery date must be provided"]
    },
    menuref: {
        type: Schema.Types.ObjectId,
        ref: "Menu"
    },
    meals: {
        type: String,
        enum: ["breakfast", "lunch", "dinner"],
        required: [true, "meals value must be provided"]
    },
    deliveryDetails: {
        deliveryAgentRef: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        deliveryTime: {
            type: String,
            trim: true
        }

    },
    orderStatus: {
        type: String,
        enum: ["upcoming", "processing", "delivery agent assigned", "completed", "cancelled"],
        default: "upcoming"
    },
    cancellationDetails: {
        cancelled: {
            type: Boolean,
            default: false
        },
        refundEligibility: {
            type: Boolean,
            default: false
        }
    }

}, { timestamps: true })

const Order = mongoose.model("Order", orderSchema)

module.exports = Order