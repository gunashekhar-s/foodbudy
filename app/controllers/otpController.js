const otpController = {} // not using
otpController.sendOtp = (req, res) => {
    // const body = req.body
    // const otpFor = body.verificationFor === "reset" ? "Password Reset" : "Registration"
    // const otp = generateNewOtp()
    // var transporter = nodemailer.createTransport({
    //     service: "hotmail",
    //     auth: {
    //         user: process.env.YAHOO_EMAIL,
    //         pass: process.env.YAHOO_PASSWORD
    //     }
    // });

    // const optons = {
    //     from: process.env.YAHOO_EMAIL,
    //     to: body.email,
    //     subject: `OTP for ${otpFor}- FoodBuddy`,
    //     text: `${otp} - OTP valid for 10 minutes only`
    // }


    // transporter.sendMail(optons, (err, result) => {
    //     if (err) {
    //         console.log(err)
    //         res.json({ error: "unable to send email" })
    //     } else {
    //         res.json('thanks for e-mailing me');
    //     }
    // })


}


module.exports = otpController