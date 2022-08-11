const User = require("../models/user")
const isEmail = require("validator/lib/isEmail")
const userController = {}

userController.register = (req, res) => {
    const body = req.body
    const newUser = new User(body)
    newUser.save()
        .then((user) => {
            res.status(200).send({ message: "registered" })
        })
        .catch((err) => {
            res.json(err)
        })
}
userController.login = (req, res) => {
    console.log("login")

    const body = req.body
    // for phone number
    // const field = isNaN(body.emailOrPhone) ? { email: body.emailOrPhone } : { phone: body.emailOrPhone }
    User.findOne({ email: body.email })
        .then((user) => {
            if (!user) {
                res.json({ error: 'Invalid login credentials' })
            } else {
                return user.generateToken(body.password)
            }
        })
        .then((token) => {
            res.json(token)
        })
        .catch((err) => {
            res.json(err)
        })
}

userController.findUser = (req, res) => {
    const tokenData = req.token
    User.findById({ _id: tokenData._id }, "_id username email role ")
        .then((user) => {
            if (!user) {
                res.json({ error: 'invalid user id' })
            } else {
                res.json(user)
            }
        })
}

userController.sendOtp = (req, res) => {
    const body = req.body
    if (!body.email) {
        res.json({ error: "email cannot be empty" })
    } else if (!isEmail(body.email)) {
        res.json({ error: "invalid email address" })
    } else if (!["register", "reset"].includes(body.verificationFor)) {
        res.json({ error: "invalid verificationfor value" })
    } else {
        User.checkEmailAndGenerateOtp(body)
            .then((otpDetails) => {
                res.json(otpDetails)
            })
            .catch((err) => {
                res.json(err)
            })
    }

}

userController.checkOtpAndRegisterOrReset = (req, res) => {
    const body = req.body
    if (!body.otp) {
        res.json({ error: "OTP cannot be empty" })
    } else if (!body.verificationFor || !["register", "reset"].includes(body.verificationFor)) {
        res.json({ error: "Invalid verificationfor value" })
    } else if (isNaN(body.otp)) {
        res.json({ error: "Invalid OTP" })
    } else if (!body.certificationKey) {
        res.json({ error: "certification key cannot be empty" })
    } else if (!body.email) {
        res.json({ error: "email address cannot be empty" })
    } else if (!isEmail(body.email)) {
        res.json({ error: "Invalid email address" })
    } else {
        User.verifyOtpAndRegisterOrReset(body)
            .then((response) => {
                res.json(response)
            })
            .catch((err) => {
                res.json(err)
            })
    }
}


module.exports = userController