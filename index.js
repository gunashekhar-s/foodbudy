
require('dotenv').config()
const express = require("express")
const path = require('path')
const axios = require("axios")
const Razorpay = require('razorpay');

const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT
const configureDb = require("./config/database")
const authRouter = require('./routes/authRoutes')
const userRouter = require("./routes/userRoutes")
const adminRouter = require("./routes/adminRoutes");
const publicRouter = require('./routes/publicRoutes');
configureDb()
app.use(cors())
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/public", publicRouter)




//* set static directory
// app.use(express.static("public"))
// app.use('/images', express.static(path.join(__dirname, 'images')))
// app.use('/static', express.static('public'))

// app.use('/images', express.static('images'));
// app.use('/images', express.static('images'));


//* payment test
app.post("/test", (req, res) => {
    const amount = (1200 * 100).toString()

    var instance = new Razorpay({
        key_id: 'rzp_test_bcd97RFqdrtZ09',
        key_secret: 'tA34ANOdGLAV8EUC9UJBsMG0',
    });
    instance.orders.create({
        amount: amount,
        currency: "INR",
        receipt: String(Date.now()),
    })
        .then((response) => {
            res.json({ id: "order_JtWcam3bD9Ye6q", amount: "1980000" })

        })
        .catch((err) => {
            console.log(err)
        })
    // console.log(instance.orders.all(option))
})

app.listen(PORT, () => {
    console.log("server is live on port : " + PORT)
})