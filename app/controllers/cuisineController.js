const Cuisine = require("../models/cuisine")

const cuisineController = {}

cuisineController.create = (req, res) => {
    const body = req.body
    body.img = `C:/Users/Geek/Desktop/DCT/foodbuddy_v1/food_app_v1_fs/images/${req.file.filename}`
    const newCuisine = new Cuisine(body)
    newCuisine.save()
        .then((cuisine) => {
            res.json({ message: "cuisine created", cuisine: cuisine })
        })
        .catch((err) => {
            res.json(err)
        }
        )
}

cuisineController.show = (req, res) => {

    const id = req.params.cuisineId
    Cuisine.findById({ _id: id })
        .then((cuisine) => {
            if (!cuisine) {
                res.json({ error: "invalid cuisine id" })
            } else {
                res.json(cuisine)
            }
        })
}

cuisineController.showAll = (req, res) => {
    Cuisine.find()
        .then((cuisines) => {
            res.json(cuisines)
        })
        .catch((err) => {
            res.json(err)
        })
}

cuisineController.update = (req, res) => {
    const body = req.body
    body.img = `C:/Users/Geek/Desktop/DCT/foodbuddy_v1/food_app_v1_fs/images/${req.file.filename}`
    const id = req.params.cuisineId
    Cuisine.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        .then((cuisine) => {
            if (!cuisine) {
                res.json({ error: "invalid cuisine id" })
            } else {
                res.json({ message: "cuisine updated", cuisine: cuisine })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

cuisineController.remove = (req, res) => {
    const id = req.params.cuisineId

    Cuisine.findByIdAndDelete(id)
        .then((cuisine) => {
            if (!cuisine) {
                res.json({ error: "invalid cuisine id" })
            } else {
                res.json({ message: "cuisine removed", _id: cuisine._id })
            }
        })
        .catch((err) => {
            res.json(err)
        })

}




module.exports = cuisineController