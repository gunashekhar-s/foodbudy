const mongoose = require("mongoose")
const Schema = mongoose.Schema
const uniqueValidator = require('mongoose-unique-validator');


const cuisineSchema = new Schema({
    title: {
        type: String,
        required: [true, "title cannot be empty"],
        trim: true,
        minlength: 4,
        maxlength: 128,
        unique: true
    },
    img: {
        type: String,
        required: [true, "image url cannot be empty"]
    }
}, { collation: { locale: 'en_US', strength: 2 }, timestamps: true })





cuisineSchema.plugin(uniqueValidator)

const Cuisine = mongoose.model("Cuisine", cuisineSchema)

module.exports = Cuisine