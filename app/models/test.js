const moment = require("moment")
const sub = {
    "_id": "62d0f9e7f34621871ccb7b39",
    "userRef": "62b40624773c6e3992515366",
    "mealsDetails": [
        {
            "meals": "Breakfast",
            "cuisineRef": "62b953e75449486a1c87dcf6",
            "isVeg": true,
            "quantity": 3,
            "startDate": "2022-07-13T18:30:00.000Z",
            "endDate": "2022-08-13T00:00:00.000Z",
            "pricePerMeal": 132,
            "pricePerDay": 396,
            "totalAmount": 11880,
            "addressRef": "62caac16bb86a147f1fe05e3",
            "_id": "62d0f9e7f34621871ccb7b3a"
        },
        {
            "meals": "Lunch",
            "cuisineRef": "62b953e75449486a1c87dcf6",
            "isVeg": true,
            "quantity": 2,
            "startDate": "2022-07-13T18:30:00.000Z",
            "endDate": "2022-08-13T00:00:00.000Z",
            "pricePerMeal": 132,
            "pricePerDay": 264,
            "totalAmount": 7920,
            "addressRef": "62caac16bb86a147f1fe05e3",
            "_id": "62d0f9e7f34621871ccb7b3b"
        }
    ],
    "finalAmountPerDay": 660,
    "finalAmount": 19800,
    "orderId": "order_JtWcam3bD9Ye6q",
    "orderAmountInPaisa": 1980000,
    "paymentStatus": "success",
    "active": true,
    "createdAt": "2022-07-15T05:23:51.722Z",
    "updatedAt": "2022-07-15T06:10:38.517Z",
    "__v": 0
}
let orders

const allDates = sub.mealsDetails.map(meal => {
    return [meal.startDate, meal.endDate]
})
console.log("dates", allDates)
const sortedDates = allDates.flat().sort((x, y) => {
    if (x < y) {
        return -1
    }
    if (x > y) {
        return 1
    }
    return 0
})
console.log(sortedDates)

sub.mealsDetails.forEach(meal => {
    const userRef = sub.userRef
    const subscriptionRef = sub._id
    const cuisineRef = meal.cuisineRef
    const isVeg = meal.isVeg
    const dates = []
    for (let i = moment(meal.startDate); !i.isAfter(meal.endDate); i = moment(i).add(1, "days")) {
        dates.push(i.format("YYYY-MM-DD"))
    }
    for (let i = 1; i <= meal.quantity; i++) {
        orders = dates.map(date => {
            const order = { userRef, subscriptionRef, cuisineRef, isVeg, deliveryDate: date, meals: meal.meals }
            return order
        })
    }
})

// console.log(orders)
// console.log(orders.length)