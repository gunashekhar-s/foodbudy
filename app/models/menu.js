const mongoose = require("mongoose")
const Schema = mongoose.Schema

const menuSchema = new Schema({
    menuDate: {
        type: Date,
        required: [true, "menu date is required"]
    },
    isVeg: {
        type: Boolean,
        required: [true, "isveg boolean value must be provided"],
    },
    mealSession: {
        type: String,
        required: [true, "meals value must be provided"],
        enum: ["Breakfast", "Lunch", "Dinner"],
        trim: true,

    },
    cuisineRef: {
        type: Schema.Types.ObjectId,
        ref: "Cuisine",
        required: true
    },
    comboRef: {
        type: Schema.Types.ObjectId,
        ref: "Combo",
        required: true
    }
}, { timestamps: true })



const Menu = mongoose.model("Menu", menuSchema)

module.exports = Menu