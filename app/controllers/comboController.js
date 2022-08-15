const Item = require("../models/item")
const Combo = require("../models/combo")

const comboController = {}

comboController.create = (req, res) => {

    const body = req.body
    const categories = body.categories
    const items = categories.map(cat => cat.items).flat()
    const ids = items.map(item => item.itemRef)
    Item.find({ _id: { $in: ids } })
        .then((newItems) => {
            const nutritionFacts = {
                carbs: 0,
                fats: 0,
                protein: 0
            }
            newItems.forEach((item) => {
                nutritionFacts.carbs += item.nutritionFacts.carbs
                nutritionFacts.fats += item.nutritionFacts.fats
                nutritionFacts.protein += item.nutritionFacts.protein
            })
            body.nutritionFacts = nutritionFacts

            const newCombo = new Combo(body)
            newCombo.save()
                .then((combo) => {

                    res.json({ message: "combo created", combo: combo })
                })
                .catch((err) => {
                    res.json(err)
                })

        })
        .catch((err) => {
            res.json(err)
        })
}

comboController.update = (req, res) => {
    const id = req.params.comboId
    const body = req.body
    Combo.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        .then((combo) => {
            if (!combo) {
                res.json({ error: "invalid combo id" })
            } else {
                res.json({ messag: "combo updated", combo: combo })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}


comboController.show = (req, res) => {
    const id = req.params.comboId
    Combo.findById(id)
        .then((combo) => {
            if (!combo) {
                res.json({ error: "invalid combo id" })
            } else {
                res.json(combo)
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

comboController.showAll = (req, res) => {
    Combo.find()
        .then((combos) => {
            res.json(combos)
        })
        .catch((err) => {
            res.json(err)
        })
}


comboController.remove = (req, res) => {
    const id = req.params.comboId
    Combo.findByIdAndDelete(id)
        .then((combo) => {
            if (!combo) {
                res.json({ error: "inavlid combo id" })
            } else {
                res.json({ message: "combo deleted", _id: combo._id })
            }
        })
}

comboController.filterComboByIsVegAndCuisine = (req, res) => {
    const cuisineId = req.body.cuisineRef
    const isVeg = req.body.isVeg
    if (!cuisineId || (typeof isVeg !== "boolean")) {
        res.json({ error: "cuisines id and isVeg must be provided" })
    } else {
        Combo.find({ cuisineRef: cuisineId, isVeg: isVeg })
            .then((combos) => {
                res.json(combos)
            })
            .catch((err) => {
                res.json(err)
            })
    }
}

module.exports = comboController