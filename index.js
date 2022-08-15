
require('dotenv').config()
const express = require("express")

const app = express()
const cors = require("cors")
app.use(express.json())
app.use(cors())

const PORT = process.env.PORT
const configureDb = require("./config/database")
const authRouter = require('./routes/authRoutes')
const userRouter = require("./routes/userRoutes")
const adminRouter = require("./routes/adminRoutes")
const publicRouter = require('./routes/publicRoutes')

configureDb()
app.use(cors())
app.use("/auth", authRouter)
app.use("/user", userRouter)
app.use("/admin", adminRouter)
app.use("/public", publicRouter)

app.listen(PORT, () => {
    console.log("server is live on port : " + PORT)
})