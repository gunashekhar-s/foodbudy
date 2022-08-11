const mongoose = require("mongoose")
const Schema = mongoose.Schema







const preferenceSchema = new Schema({
    mealSessions: [{
        type: String,
        required: true,
        enum: ["Breakfast", "Lunch", "Dinner"],
        trim: true
    }],
    isVeg: {
        type: Boolean,
        requierd: [true, "isVeg boolean value must be provided"]
    },
    vegDays: {
        type: [{
            type: String,
            enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        }]
    },
    cuisineRef: {
        type: Schema.Types.ObjectId,
        ref: "Cuisine",
        required: true
    },
    userRef: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

}, { collation: { locale: 'en_US', strength: 2 } }, { timestamps: true })


const Preference = mongoose.model("Preference", preferenceSchema)

module.exports = Preference