const Category = require("../models/category")

const categoryController = {}

categoryController.create = (req, res) => {
    const body = req.body
    const newCategory = new Category(body)
    newCategory.save()
        .then((category) => {
            res.json({ message: "category created", category: category })
        })
        .catch((err) => {
            res.json(err)
        })
}

categoryController.update = (req, res) => {
    const id = req.params.categoryId
    const body = req.body
    Category.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        .then((category) => {
            if (!category) {
                res.json({ error: "invalid category id" })
            } else {
                res.json({ message: "category updated", category: category })
            }
        })
}

categoryController.showAll = (req, res) => {
    Category.find()
        .then((categories) => {
            res.json(categories)
        })
        .catch((err) => {
            res.json(err)
        })
}

categoryController.remove = (req, res) => {
    const id = req.params.categoryId
    Category.findByIdAndDelete(id)
        .then((category) => {
            if (!category) {
                res.json({ error: "invalid category id" })
            } else {
                res.json({ message: "category removed", category: category })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

categoryController.show = (req, res) => {

    const id = req.params.categoryId
    Category.findById({ _id: id })
        .then((category) => {
            if (!category) {
                res.json({ error: "invalid category id" })
            } else {
                res.json(category)
            }
        })
}

module.exports = categoryController