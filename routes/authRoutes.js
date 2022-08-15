const express = require("express")
const authRouter = express.Router()
const userController = require("../app/controllers/userController")

// authRouter.post("/register", userController.register)
authRouter.post("/login", userController.login)
authRouter.post("/sendotp", userController.sendOtp)
authRouter.post("/verify", userController.checkOtpAndRegisterOrReset)



module.exports = authRouter