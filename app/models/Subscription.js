const moment = require("moment")
const mongoose = require("mongoose")
const Schema = mongoose.Schema
const Payment = require("./payment")
const Order = require("./order")

const subscriptionSchema = new Schema({
    userRef: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "userId must be provided"]
    },
    subscriptionPlanRef: {
        type: Schema.Types.ObjectId,
        ref: "SubscriptionPlan",
        required: [true, "subscriptionPlanId must be provided"]
    },
    mealsDetails: [{
        meals: {
            type: String,
            enum: ["Breakfast", "Lunch", "Dinner"],
            required: [true, "meals value must be provided"]
        },
        cuisineRef: {
            type: Schema.Types.ObjectId,
            ref: "Cuisine",
            required: [true, "cuisineId must be provided"]
        },
        isVeg: {
            type: Boolean,
            required: [true, "isVeg boolean must be provided"]
        },
        quantity: {
            type: Number,
            required: [true, "quantity value must be provided"],
            min: 1,
            max: 10
        },
        startDate: {
            type: Date,
            required: [true, "start date must be provided"]
        },
        endDate: {
            type: Date,
            required: [true, "end date must be provided"]
        },
        pricePerMeal: {
            type: Number,
            required: [true, "price per meal must be provided"],
            maxlength: 4
        },
        pricePerDay: {
            type: Number,
            required: [true, "price per day must be provided"],
            maxlength: 4
        },
        totalAmount: {
            type: Number,
            required: [true, "total amount must be provided"],
            maxlength: 4
        }

    }],
    finalAmountPerDay: {
        type: Number,
        required: [true, "final amount must be provided"]
    },
    finalAmount: {
        type: Number,
        required: [true, "final amount must be provided"]
    },
    orderId: {
        type: String,
        required: [true, "orderId must be provided"]
    },
    orderAmountInPaisa: {
        type: Number,
        required: [true, "order amount must be provided"]
    },
    paymentStatus: {
        type: String,
        enum: ["success", "failed"],
        default: "failed",
        required: [true, "payment status is required"]
    },
    active: {
        type: Boolean,
        required: [true, "active boolean value must be provided"],
        default: true
    }

}, { timestamps: true })


//instance methods
subscriptionSchema.methods.updatePaymentStatus = function (data) {
    const subscription = this
    subscription.paymentStatus = "success"
    return subscription.save()
        .then(sub => {
            console.log("data", sub)

            const subscriptionRef = sub._id
            const transactionAmountInPaisa = sub.orderAmountInPaisa
            const { order_id, payment_id, signature } = data

            const newPayment = new Payment({ subscriptionRef, transactionAmountInPaisa, order_id, payment_id, signature })


            const userRef = sub.userRef
            const orders = []

            const dates = []
            // console.log(moment(sub.startDate).isAfter(moment().format('YYYY-MM-DD')))
            // console.log(moment(sub.startDate).add(1, "days").format('YYYY-MM-DD'))]
            // console.log(sub.startDate)
            // for (let i = sub.startDate; !moment(i).isAfter(sub.endDate); i = moment(i).add(1, "days").format('YYYY-MM-DD')) {
            //     console.log(sub.startDate)
            // }




            // return newPayment.save()
            //     .then(payment => {
            //         //order must be created

            //     })

        })
        .catch((err) => {
            console.log("here")
            return Promise.reject(err)
        })
}


const Subscription = mongoose.model("Subscription", subscriptionSchema)

module.exports = Subscription