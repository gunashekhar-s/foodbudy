const mongoose = require('mongoose')
const Schema = mongoose.Schema
const nodemailer = require("nodemailer")
const CryptoJS = require("crypto-js")
const moment = require("moment")
const generateNewOtp = require("../middlewares/otpGenerator")
// var smtpTransport = require('nodemailer-smtp-transport');
const mailgun = require("mailgun-js");

const OtpSchema = new Schema({
    otp: {
        type: String,
        required: true
    },
    expiresIn: {
        type: Date,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    sentTo: {
        type: String,
        required: true
    },
    verificationFor: {
        type: String,
        requierd: true,
        enum: ['register', 'reset'],
    }

}, { timestamps: true })

//own static methods
OtpSchema.statics.generateOtpAndSend = function (newData) {

    const otpFor = newData.verificationFor === "reset" ? "Password Reset" : "Registration"
    const otp = generateNewOtp()

    // const DOMAIN = 'sandboxe90e2aa99f7c40fd9bb5941790a66279.mailgun.org';
    // const mg = mailgun({ apiKey: "ccd430d4ee32791dd50d37a3463ecdb1-787e6567-24f721b4", domain: DOMAIN });
    const DOMAIN = 'sandbox3caf9af958554de2a39d2b674a992afd.mailgun.org';
    const mg = mailgun({ apiKey: "cf3514cd7b2a289c4dd96a4b3c580274-4dd50799-f43d51f8", domain: DOMAIN });
    const data = {
        from: process.env.EMAIL,
        to: newData.email,
        subject: `OTP for ${otpFor}- FoodBuddy`,
        text: `${otp} - OTP valid for 10 minutes only`
    };
    return mg.messages().send(data)
        .then((result) => {
            console.log("result", result)
            const otpData = {
                otp,
                expiresIn: moment(new Date()).add(10, 'minutes').format(),
                verified: false,
                sentTo: newData.email,
                verificationFor: newData.verificationFor
            }

            const newOtp = new this(otpData)
            return newOtp.save()
                .then((otp) => {
                    // encrypting details and sending it as cerification key to client
                    const encoded = CryptoJS.AES.encrypt(JSON.stringify({ ...otpData, otpId: otp._id }), process.env.CRYPTO_JS_SECRET_KEY).toString()

                    return Promise.resolve({ message: "otp sent", certificationKey: encoded })
                })
                .catch((err) => {

                    return Promise.reject(err)
                })
        })
        .catch((err) => {

            console.log(err)
            return Promise.reject({ error: "unable to send email" })

        })
    // var transporter = nodemailer.createTransport(smtpTransport, {
    //     service: 'gmail',
    //     host: 'smtp.gmail.com',
    //     auth: {
    //         user: process.env.YAHOO_EMAIL,
    //         pass: process.env.YAHOO_PASSWORD
    //     }

    // });
    // var transporter = nodemailer.createTransport({
    //     service: "gmail",
    //     auth: {
    //         user: process.env.YAHOO_EMAIL,
    //         pass: process.env.YAHOO_PASSWORD
    //     }
    // });

    // const optons = {
    //     from: process.env.YAHOO_EMAIL,
    //     to: data.email,
    //     subject: `OTP for ${otpFor}- FoodBuddy`,
    //     text: `${otp} - OTP valid for 10 minutes only`
    // }

    // return transporter.sendMail(optons)
    //     .then((result) => {
    //         const otpData = {
    //             otp,
    //             expiresIn: moment(new Date()).add(10, 'minutes').format(),
    //             verified: false,
    //             sentTo: newData.email,
    //             verificationFor: newData.verificationFor
    //         }

    //         const newOtp = new this(otpData)
    //         return newOtp.save()
    //             .then((otp) => {

    //                 // encrypting details and sending it as cerification key to client
    //                 const encoded = CryptoJS.AES.encrypt(JSON.stringify({ ...otpData, otpId: otp._id }), process.env.CRYPTO_JS_SECRET_KEY).toString()
    //                 return Promise.resolve({ message: "otp sent", certificationKey: encoded })
    //             })
    //             .catch((err) => {
    //                 return Promise.reject(err)
    //             })
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //         return Promise.reject({ error: "unable to send email" })

    //     })

}

OtpSchema.statics.verify = function (data) {
    const certificationKey = data.certificationKey
    try {
        const bytes = CryptoJS.AES.decrypt(certificationKey, process.env.CRYPTO_JS_SECRET_KEY);
        const decodedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        return this.findOne({ _id: decodedData.otpId })
            .then((otpInstance) => {
                if (!otpInstance) {
                    return Promise.reject({ error: "Invalid OTP" })
                } else {
                    if (!moment().isAfter(moment(otpInstance.expiresIn).format())) {
                        if (data.verificationFor === otpInstance.verificationFor) {
                            if (!otpInstance.verified) {
                                if (data.otp === otpInstance.otp) {
                                    otpInstance.verified = true
                                    return otpInstance.save()
                                        .then((otp) => {
                                            return Promise.resolve(otp)
                                        })
                                        .catch((err) => {
                                            return Promise.reject(err)
                                        })
                                } else {
                                    return Promise.reject({ error: "Invalid OTP" })
                                }
                            } else {
                                return Promise.reject({ error: "OTP already used or verified" })
                            }

                        } else {
                            return Promise.reject({ error: "OTP was not sent for this request " })
                        }
                    } else {
                        return Promise.reject({ error: "OTP Expired" })
                    }
                }
            })
            .catch((err) => {
                return Promise.reject(err)
            })

    } catch (error) {
        return Promise.reject({ message: "Invalid Certification Key" })
    }
}
const OTP = mongoose.model("OTP", OtpSchema)


module.exports = OTP