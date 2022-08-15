const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const itemSchema = new Schema({
    title: {
        type: String,
        required: [true, "title cannot be empty"],
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 128
    },
    isVeg: {
        type: Boolean,
        requred: true
    },
    categoryRef: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    nutritionFacts: {
        carbs: {
            type: Number,
            required: true
        },
        fats: {
            type: Number,
            required: true
        },
        protein: {
            type: Number,
            required: true
        }
    }

}, { collation: { locale: 'en_US', strength: 2 } }, { timestamps: true })


itemSchema.plugin(uniqueValidator)

const Item = mongoose.model("Item", itemSchema)

module.exports = Item