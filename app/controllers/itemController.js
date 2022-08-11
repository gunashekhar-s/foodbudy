const Item = require("../models/item")

const itemController = {}
itemController.create = (req, res) => {
    const body = req.body
    //TODO: verify category id before saving 
    const newItem = new Item(body)
    newItem.save()
        .then((item) => {
            res.json({ message: "item created", item: item })
        })
        .catch((err) => {
            res.json(err)
        })
}

itemController.showAll = (req, res) => {
    Item.find()
        .then((items) => {
            res.json(items)
        })
        .catch((err) => {
            res.json(err)
        })
}

itemController.show = (req, res) => {
    const id = req.params.itemId
    Item.findById(id)
        .then((item) => {
            if (!item) {
                res.json({ error: "invalid item id" })
            } else {
                res.json(item)
            }
        })
}


itemController.update = (req, res) => {
    const id = req.params.itemId
    const body = req.body
    //TODO: verify category id before updating 
    Item.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        .then((item) => {
            if (!item) {
                res.json({ error: "invalid item id" })
            } else {
                res.json({ message: "item updated", item: item })
            }
        })
}

itemController.remove = (req, res) => {
    const id = req.params.itemId
    Item.findByIdAndDelete(id)
        .then((item) => {
            if (!item) {
                res.json({ error: "invalid item id" })
            } else {
                res.json({ message: "item removed", item: item })
            }
        })
}

itemController.filteredItems = (req, res) => {
    const body = req.body
    if (!body.isVeg === undefined || !body.categoryId) {
        res.json({ error: "filter options missing" })
    } else {
        // const ObjectId = mongoose.Types.ObjectId;
        // new ObjectId(body.categoryId)
        // above code is used to convert string to object Id
        Item.find({ isVeg: body.isVeg, categoryId: body.categoryId })
            .then((items) => {
                res.json(items)
            })
            .catch((err) => {
                res.json(err)
            })
    }
}
//need to add filter for only veg

module.exports = itemController