const Restaurant = require("../models/restaurant")

const restaurantController = {}
restaurantController.create = (req, res) => {
    console.log("restaurant create")
    const body = req.body
    if (!body.userRef) {
        res.json({ error: "valid userId must be provided" })
    } else {
        Restaurant.find({ userRef: body.userRef })
            .then((restaurants) => {
                if (restaurants.length === 0) {
                    const newRestaurant = new Restaurant(body)
                    newRestaurant.save()
                        .then((restaurant) => {
                            res.json({ message: "restaurant created", restaurant: restaurant })
                        })
                        .catch((err) => {
                            res.json(err)
                        })
                } else {
                    res.json({ message: "restaurant exists, cannot create additional restaurant" })
                }
            })
    }

}

restaurantController.show = (req, res) => {
    const id = req.params.restaurantId
    const body = req.body
    if (!id) {
        res.json({ error: "valid restaurantId must be provided" })
    } else if (!body.userId) {
        res.json({ error: "valid userId must be provided" })
    } else {
        Restaurant.find({ _id: id, userRef: body.userId })
            .then((restaurant) => {
                if (restaurant.length === 0) {
                    res.json({ error: "invalid restaurantId" })
                } else {
                    res.json(restaurant)
                }
            })
            .catch((err) => {
                res.json(err)
            })
    }
}

restaurantController.getRestaurantDetails = (req, res) => {
    //* temperory method - workaround
    Restaurant.find()
        .then((restaurant) => {
            if (restaurant.length === 0) {
                res.json("no restaurants forund")
            } else {
                res.json(restaurant[0])
            }
        })
        .catch((err) => {
            res.json(err)
        })

}


module.exports = restaurantController