const mongoose = require("mongoose")


const configureDb = () => {
    mongoose.connect("mongodb://localhost:27017/food_app_v1_dbs")
        .then(() => {
            console.log("Successfully connected to database : food_app_v1_dbs")
        })
        .catch(() => {
            console.log("error connecting db food_app_v1_dbs")
        })

}


module.exports = configureDb