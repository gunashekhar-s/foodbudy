const Restaurant = require("../models/restaurant")
const SubscriptionPlan = require("../models/subscriptionPlan")
const Address = require("../models/address")
const Preference = require("../models/preference")
const moment = require("moment")
const Razorpay = require('razorpay')
const Subscription = require("../models/Subscription")

const subscriptionController = {}

subscriptionController.create = (req, res) => {
    const body = req.body
    //TODO handle start date - form filled with start date but submitted at later time, this might cause placing order for past time
    Restaurant.findById(body.restaurantId)
        .then((restaurant) => {
            if (!restaurant) {
                res.json({ error: "invalid restaurantId" })
            } else {
                const id = body.selectedPlanId
                SubscriptionPlan.findById(id)
                    .then((plan) => {
                        if (!plan) {
                            res.json({ error: "invalid subscriptionPlanId" })
                        } else {
                            Address.findById(body.addressId)
                                .then((address) => {
                                    if (!address) {
                                        res.json({ error: "invalid addressId" })
                                    } else {
                                        Preference.findById(body.preferenceId)
                                            .then((preference) => {
                                                if (!preference) {
                                                    res.json({ error: "invalid preferenceId" })
                                                } else {
                                                    const mealSessions = preference.mealSessions.map(meal => {
                                                        return {
                                                            meals: meal,
                                                            startDate: body.startDates[meal],
                                                            endDate: moment(body.startDates[meal]).add(plan.days, "days"),
                                                            pricePerMeal: plan.pricePerDay,
                                                            pricePerDay: plan.pricePerDay * body.quantities[meal],
                                                            totalAmount: plan.pricePerDay * body.quantities[meal] * plan.days,
                                                            quantity: body.quantities[meal],
                                                            isVeg: preference.isVeg,
                                                            cuisineRef: preference.cuisineRef,
                                                        }
                                                    })
                                                    const formattedData = {
                                                        userRef: req.token._id,
                                                        restaurantId: body.restaurantId,
                                                        subscriptionPlanRef: body.selectedPlanId,
                                                        mealsDetails: mealSessions,
                                                        addressRef: body.addressId,
                                                        finalAmount: mealSessions.map(ele => ele.totalAmount).reduce((a, b) => a + b)
                                                    }
                                                    formattedData.orderAmountInPaisa = formattedData.finalAmount * 100

                                                    console.log("data", formattedData)
                                                    const instance = new Razorpay({
                                                        key_id: process.env.RAZORPAY_KEY_ID,
                                                        key_secret: process.env.RAZORPAY_KEY_SECRET,
                                                    })
                                                    const options = {
                                                        amount: formattedData.orderAmountInPaisa,
                                                        currency: "INR",
                                                        receipt: String(Date.now())
                                                    }

                                                    instance.orders.create(options)
                                                        .then((order) => {
                                                            if (!order) {
                                                                res.json({ error: "unable to generate orderId - razorpay error" })
                                                            } else {
                                                                formattedData.orderId = order.id
                                                                const newSubscription = new Subscription(formattedData)
                                                                newSubscription.save()
                                                                    .then((subscription) => {
                                                                        res.json({ message: "subscription created", subscription })
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
                                            })
                                    }
                                })
                                .catch((err) => {
                                    res.json(err)
                                })
                        }
                    })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}


subscriptionController.show = (req, res) => {
    const id = req.params.subscriptionId
    Subscription.findById(id)
        .then((subscription) => {
            if (!subscription) {
                res.json({ error: "invalid subscriptionId" })
            } else {
                res.json(subscription)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}


subscriptionController.showByUserId = (req, res) => {
    const id = req.params.userId
    Subscription.find({ userRef: id })
        .then((subscriptions) => {
            if (subscriptions.length === 0) {
                res.json({ error: "no subscriptions" }) //chances of invalid userId
            } else {
                res.json(subscriptions)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

subscriptionController.showAll = (req, res) => {
    const userRef = req.token._id
    Subscription.find({ userRef }).populate("subscriptionPlanRef")
        .then((subscriptions) => {
            if (subscriptions.length === 0) {
                res.json({ error: "no subscriptions" })
            } else {

                const sortedSubscriptions = subscriptions.sort((a, b) => {
                    if (a.createdAt < b.createdAt) {
                        return 1
                    } else if (a.createdAt > b.createdAt) {
                        return -1
                    } else {
                        return 0
                    }
                })

                res.json({ subscriptions: sortedSubscriptions })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

subscriptionController.showAllActive = (req, res) => {
    Subscription.find({ active: true })
        .then((subscriptions) => {
            if (subscriptions.length === 0) {
                res.json({ error: "no active subscriptions" })
            } else {
                res.json(subscriptions)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

subscriptionController.updateVerifyAndUpdatePayment = (req, res) => {
    const { order_id, payment_id, signature, subscriptionId } = req.body
    const isValid = validatePaymentVerification({ order_id, payment_id }, signature, process.env.RAZORPAY_KEY_SECRET)
    if (isValid) {
        Subscription.findById(subscriptionId)
            .then(subscription => {
                if (!subscription) {
                    return Promise.reject({ error: "invalid subscriptionId" })
                } else {
                    subscription.updatePaymentStatus({ order_id, payment_id, signature, subscriptionId })
                        .then(() => {

                        })
                        .catch((err) => {
                            res.json(err)
                        })

                }
            })

    } else {
        res.json({ error: "payment verification failed - invalid payment" })
    }
}


subscriptionController.startDates = (req, res) => {

    const body = req.body
    const meals = body.meals
    if (!Array.isArray(meals) || !meals) {
        res.json({ error: "meals must be a valid array" })
    } else if (meals.length === 0) {
        res.json({ error: "meals cannot be an empty array" })
    } else if (!meals.every(m => ["Breakfast", "Lunch", "Dinner"].includes(m))) {
        res.json({ error: "invalid meals value" })
    } else {

        Restaurant.findById(body.restaurantId)
            .then((restaurant) => {
                if (!restaurant) {
                    res.json({ error: "invalid restaurantId" })
                } else {

                    const timeMargin = restaurant.allowedTimeMargin
                    const breakfastTime = restaurant.mealSessions?.Breakfast?.start?.split(":")
                    const lunchTime = restaurant.mealSessions?.Lunch?.start.split(":")
                    const dinnerTime = restaurant.mealSessions?.Dinner?.start.split(":")
                    const currentTime = moment().format("HH:mm").split(":")

                    const compareTime = (current, fixed) => {
                        if ((Number(current[0]) + timeMargin) > 23) {
                            return false
                        } else if (Number(current[0]) + timeMargin > Number(fixed[0])) {
                            return false
                        } else if (Number(current[0]) + timeMargin === Number(fixed[0])) {

                            if (Number(current[1]) >= Number(fixed[1])) {
                                return false
                            } else {
                                return true
                            }
                        } else {
                            return true
                        }
                    }
                    const startDates = meals.map(meal => {
                        if (meal === "Breakfast") {
                            return compareTime(currentTime, breakfastTime) ? { Breakfast: moment().format('YYYY-MM-DD') } : { Breakfast: moment().add(1, "days").format('YYYY-MM-DD') }
                        } else if (meal === "Lunch") {
                            return compareTime(currentTime, lunchTime) ? { Lunch: moment().format('YYYY-MM-DD') } : { Lunch: moment().add(1, "days").format('YYYY-MM-DD') }
                        } else if (meal === "Dinner") {
                            return compareTime(currentTime, dinnerTime) ? { Dinner: moment().format('YYYY-MM-DD') } : { Dinner: moment().add(1, "days").format('YYYY-MM-DD') }
                        }
                    })
                    let newDates = {}
                    startDates.forEach((item => {
                        newDates = { ...newDates, ...item }
                    }))
                    res.json({ message: "dates created", dates: newDates })

                }
            })
            .catch((err) => {
                res.json(err)
            })
    }
}


module.exports = subscriptionController