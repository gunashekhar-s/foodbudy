const express = require("express")
const preferenceController = require("../app/controllers/preferenceController")
const userRouter = express.Router()
const userController = require("../app/controllers/userController")
const addressController = require("../app/controllers/addressController")
const { authenticateUser } = require("../app/middlewares/authenticateUser")
const subscriptionController = require("../app/controllers/subscriptionController")
const menuController = require("../app/controllers/menuController")
const subscriptionPlanController = require("../app/controllers/subscriptionPlanController")


userRouter.get("/account", authenticateUser, userController.findUser)

// preferences routes
userRouter.post("/preference", authenticateUser, preferenceController.create)
userRouter.get("/preference/:userRef", authenticateUser, preferenceController.find)
userRouter.put("/preference/:preferenceId", authenticateUser, preferenceController.update)


//address routes
userRouter.post("/address", authenticateUser, addressController.create)
userRouter.get("/address", authenticateUser, addressController.showAll)
userRouter.get("/address/:userId", authenticateUser, addressController.find)
userRouter.put("/address/:addressId", authenticateUser, addressController.update)
userRouter.delete("/address/:addressId", authenticateUser, addressController.remove)

//plan routes
userRouter.get("/plans/:preferenceId", authenticateUser, subscriptionPlanController.showAll)

//subscription routes
userRouter.post("/subscription", authenticateUser, subscriptionController.create)
userRouter.post("/verify", authenticateUser, subscriptionController.updateVerifyAndUpdatePayment)
userRouter.get("/subscription/:subscriptionId", authenticateUser, subscriptionController.show)
userRouter.post("/startDates", authenticateUser, subscriptionController.startDates)


//menu routes
userRouter.get("/menu/:preferenceId", authenticateUser, menuController.getSevenDaysMenu)

module.exports = userRouter