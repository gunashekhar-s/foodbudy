const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uniqueValidator = require("mongoose-unique-validator")

const paymentSchema = new Schema({
    subscriptionRef: {
        type: Schema.Types.ObjectId,
        ref: "Subscription",
        unique: true,
        required: [true, "subscriptionId is required"]
    },
    payment_id: {
        type: String,
        trim: true,
        required: [true, "payemnt_id  is required"]
    },
    signature: {
        type: String,
        trim: true,
        required: [true, "signature  is required"]
    },
    order_id: {
        type: String,
        trim: true,
        required: [true, "order_id  is required"]
    },
    orderAmountInPaisa: {
        type: Number,
        required: [true, "transaction amount is required"]
    }

}, { timestamps: true })


paymentSchema.plugin(uniqueValidator)
const Payment = mongoose.model("Payment", paymentSchema)

module.exports = Payment