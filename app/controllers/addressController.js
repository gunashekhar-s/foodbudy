const Address = require("../models/address")

const addressController = {}

addressController.create = (req, res) => {
    const body = req.body
    if (!body.userRef) {
        res.json({ error: "userId must be provided" })
    } else {
        Address.find({ userRef: body.userRef })
            .then((address) => {
                if (address.length > 0) {
                    Address.findByIdAndUpdate(address[0]._id, body, { runValidators: true, new: true })
                        .then((newAddress) => {
                            res.json({ message: "address updated", address: newAddress })
                        })
                        .catch((err) => {
                            res.json(err)
                        })
                } else {
                    const newAddress = new Address(body)
                    newAddress.save()
                        .then((address) => {
                            res.json({ message: "address created", address: address })
                        })
                        .catch((err) => {
                            res.json(err)
                        })
                }
            })
            .catch((err) => {
                res.json(err)
            })
    }

}

addressController.find = (req, res) => {
    const id = req.params.userId
    Address.find({ userRef: id })
        .then((address) => {
            if (address.length === 0) {
                res.json({ error: "address doesn't exist" })
            } else {
                res.json({ address: address[0] })
            }
        })
}

addressController.showAll = (req, res) => {
    const id = req.body.userId
    if (!id) {
        res.json({ error: "userId must be provided" })
    } else {
        Address.find({ userRef: id })
            .then((address) => {
                if (address.length === 0) {
                    res.json({ error: "invalid userId" })
                } else {
                    res.json(address)
                }
            })
            .catch((err) => {
                res.json(err)
            })
    }
}

addressController.remove = (req, res) => {
    const id = req.params.addressId

    Address.findByIdAndDelete(id)
        .then((address) => {
            if (!address) {
                res.json({ error: "invalid addressId" })
            } else {
                res.json({ message: "address removed", address: address })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

addressController.update = (req, res) => {
    const body = req.body
    const id = req.params.addressId
    Address.findByIdAndUpdate(id, body, { runValidators: true, new: true })
        .then((address) => {
            if (!address) {
                res.json({ error: "invalid addressId" })
            } else {
                res.json({ message: "address updated", address: address })
            }
        })
        .catch((err) => {
            res.json(err)
        })

    console.log(moment().format("HH:mm").split(":"))
}


module.exports = addressController