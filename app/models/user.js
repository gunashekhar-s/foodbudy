const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const cryptoJs = require("crypto-js")
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator');
const OTP = require("./otp")
const isEmail = require("validator/lib/isEmail")


const userSchema = new Schema({
    username: {
        type: String,
        required: [true, "username is required"],
        minlength: 4,
        maxlength: 128
    },
    email: {
        type: String,
        required: [true, "email is required"],
        maxlength: 128,
        lowercase: true,
        trim: true,
        unique: true,
        validate: {
            validator: (value) => {
                return isEmail(value)
            },
            message: () => {
                return "invalid email address"
            }
        }
    },

    password: {
        type: String,
        required: [true, "password is requried"],
        minlength: [8, 'password must be minimum 8 characters long'],
        maxlength: [128, 'password should not be more than 128 characters long']
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'deliveryAgent'],
        default: 'user',

    }


}, { timestamps: true })

//pre hooks - Model Middleware
userSchema.pre('save', function (next) {
    const user = this
    bcrypt.genSalt(10)
        .then((salt) => {
            bcrypt.hash(user.password, salt)
                .then((hash) => {
                    user.password = hash
                    next()
                })
        })
})

// own instance methods - on instance/document
userSchema.methods.generateToken = async function (password) {
    const user = this
    const match = await bcrypt.compare(password, user.password)
    if (match) {
        const tokenData = {
            _id: user._id,
            role: user.role
        }
        // creating JSON WEB TOKEN
        const token = jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '2d' })
        // encrypting JWT TOKEN to make sure tokenData is not exposed for decryption using jwt_decode
        const encoded = cryptoJs.AES.encrypt(token, process.env.CRYPTO_JS_SECRET_KEY).toString()

        return Promise.resolve({ token: encoded })
    } else {
        return Promise.reject({ error: 'Invalid login credentials' })
    }
}

// own static method (like find, findById etc)  - on model
userSchema.statics.checkEmailAndGenerateOtp = function (data) {
    const verificationFor = data.verificationFor
    return this.findOne({ email: data.email })
        .then((user) => {
            if (user && verificationFor === "register") {
                return Promise.reject({ error: "email already exists" })
            } else if (!user && verificationFor === "register") {

                return OTP.generateOtpAndSend(data)
            } else if (!user && verificationFor === "reset") {

                return Promise.reject({ error: "email doesn't exist" })
            } else if (user && verificationFor === "reset") {
                return OTP.generateOtpAndSend(data)
            }

        })
        .catch((err) => {
            return Promise.reject(err)
        })
}

userSchema.statics.verifyOtpAndRegisterOrReset = function (data) {
    return OTP.verify(data)
        .then((otp) => {
            if (data.verificationFor === "register") {
                const userData = {
                    username: data.username,
                    email: data.email,
                    password: data.password
                }
                const newUser = new this(userData)
                return newUser.save()
                    .then((user) => {
                        return Promise.resolve({ message: "registered" })
                    })
                    .catch((err) => {
                        return Promise.reject(err)
                    })
            } else if (data.verificationFor === "reset") {
                return this.findOne({ email: data.email })
                    .then((user) => {

                        user.password = data.password
                        return user.save()
                            .then((newUser) => {

                                return Promise.resolve({ message: "password changed" })
                            })
                            .catch((err) => {
                                return Promise.reject(err)
                            })
                    })
            }

        })
        .catch((err) => {
            return Promise.reject(err)
        })
}


userSchema.plugin(uniqueValidator);

const User = mongoose.model("User", userSchema)
module.exports = User