const Preference = require("../models/preference")
const SubscriptionPlan = require("../models/subscriptionPlan")

const subscriptionPlanController = {}

subscriptionPlanController.create = (req, res) => {
    const body = req.body
    const newSubscriptionPlan = new SubscriptionPlan(body)
    newSubscriptionPlan.save()
        .then((subscriptionPlan) => {
            res.json({ message: "subscription plan created", subscriptionPlan: subscriptionPlan })
        })
        .catch((err) => {
            res.json(err)
        })

}

subscriptionPlanController.show = (req, res) => {
    const id = req.params.subscriptionplanId
    SubscriptionPlan.findById(id)
        .then((subscriptionPlan) => {
            if (!subscriptionPlan) {
                res.json({ error: "invalid subscriptionPlanId" })
            } else {
                res.json(subscriptionPlan)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

subscriptionPlanController.showAll = (req, res) => {
    const preferenceId = req.params.preferenceId
    Preference.findById(preferenceId)
        .then(preference => {
            if (!preference) {
                res.json({ error: "Invalid preferenceId" })
            } else {
                //.lean() to convert to plain javascript object
                SubscriptionPlan.find({ status: true }).lean()
                    .then((subscriptionPlans) => {
                        const mealsCount = preference.mealSessions.length
                        const plans = subscriptionPlans.map(plan => {
                            return { ...plan, pricePerDay: (plan.pricePerDay * mealsCount), totalPrice: (plan.totalPrice * mealsCount), mealSessions: preference.mealSessions }
                        })

                        res.json({ plans })
                    })
                    .catch((err) => {
                        res.json(err)
                    })
            }
        })
        .catch((err) => {
            res.json(err)
        })

}

subscriptionPlanController.update = (req, res) => {
    const id = req.params.subscriptionplanId
    const body = req.body

    SubscriptionPlan.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        .then((subscriptionPlan) => {
            if (!subscriptionPlan) {
                res.json({ error: "invalid subscriptionPlanId" })
            } else {
                res.json({ message: "subscription plan updated", subscriptionPlan: subscriptionPlan })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

subscriptionPlanController.remove = (req, res) => {
    const id = req.params.subscriptionplanId
    SubscriptionPlan.findByIdAndDelete(id)
        .then((subscriptionPlan) => {
            if (!subscriptionPlan) {
                res.json({ error: "invalid subsciprtionPlanId" })
            } else {
                res.json({ message: "subscription plan removed", _id: subscriptionPlan._id })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}


module.exports = subscriptionPlanController