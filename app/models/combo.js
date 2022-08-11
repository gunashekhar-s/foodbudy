const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const Schema = mongoose.Schema

const subSchemaItems = new Schema({
    itemRef: {
        type: Schema.Types.ObjectId,
        ref: "Item",
        required: true
    }
})
const subSchemaCategories = new Schema({
    categoryRef: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true
    },
    items: [subSchemaItems]
})

const comboSchema = new Schema({
    title: {
        type: String,
        required: [true, "title cannot be empty"],
        minlength: 4,
        maxlength: 128,
        trim: true,
        unique: true
    },
    cuisineRef: {
        type: Schema.Types.ObjectId,
        ref: "Cuisine",
        required: true
    },
    isVeg: {
        type: Boolean,
        required: true
    },
    categories: [subSchemaCategories],
    Price: {
        type: Number,
        required: [true, "Price cannot be empty"],
        min: 50, //temp data
        max: 2000 //temp data
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

}, { collation: { locale: 'en_US', strength: 2 }, timestamps: true })

comboSchema.plugin(uniqueValidator);

const Combo = mongoose.model("Combo", comboSchema)

module.exports = Combo