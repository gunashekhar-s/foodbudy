const Payment = require("../models/payment")
const Subscription = require("../models/Subscription")



const paymentController = {}

paymentController.create = (req, res) => {
    const newPayment = new Payment(req.body)
    newPayment.save()
        .then((payment) => {

            Subscription.findByIdAndUpdate(payment.subscriptionRef, { paymentStatus: "success" }, { runValidators: true, new: true })
                .then((subscription) => {
                    return res.json({ message: "payment created", payment })
                })
                .catch((err) => {
                    return res.json(err)
                })
        })
        .catch((err) => {
            res.json(err)
        })
}

module.exports = paymentController