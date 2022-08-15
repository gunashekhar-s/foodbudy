const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const categorySchema = new Schema({
    title: {
        type: String,
        required: [true, "title is required"],
        minlength: 4,
        maxlength: 128,
        unique: true,
        lowercase: true,
        trim: true
    }
}, { timestamps: true })

categorySchema.plugin(uniqueValidator)


const Category = mongoose.model("Category", categorySchema)
module.exports = Category 