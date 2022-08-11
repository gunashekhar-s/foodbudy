const express = require("express")
const cuisineController = require("../app/controllers/cuisineController")
const restaurantController = require("../app/controllers/restaurantController")
const publicRouter = express.Router()

publicRouter.get("/cuisines", cuisineController.showAll)
publicRouter.get("/restaurant", restaurantController.getRestaurantDetails)
module.exports = publicRouter