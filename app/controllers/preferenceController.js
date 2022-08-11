const Preference = require("../models/preference")

const preferenceController = {}

preferenceController.create = (req, res) => {
    const body = req.body
    const isVeg = body.isveg
    const vegDays = body.vegDays
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const validDays = days.every(day => vegDays.includes(day))
    if (isVeg && !validDays) {
        res.json({ error: "if isVeg is true, vegDays must include all days of the week" })
    } else {


        const newPreference = new Preference(body)

        Preference.find({ userRef: body.userRef })
            .then((preference) => {
                if (preference.length === 0) {
                    newPreference.save()
                        .then((preference) => {
                            preference.populate("cuisineRef")
                                .then((data) => {
                                    res.json({ message: "preference created", preference: data })
                                })
                        })
                        .catch((err) => {
                            res.json(err)
                        })
                } else {
                    res.json({ error: "preference exists for the user" })
                }
            })
    }
}

preferenceController.update = (req, res) => {
    const id = req.params.preferenceId
    const body = req.body
    if (!id) {
        res.json({ error: "valid preferenceId must be provided" })
    } else {
        Preference.findByIdAndUpdate(id, body, { runValidators: true, new: true }).populate("cuisineRef")
            .then((preference) => {
                if (!preference) {
                    res.json({ error: "invalid preferenceId" })
                } else {
                    res.json({ message: "preference updated", preference: preference })
                }
            })
    }
}

preferenceController.find = (req, res) => {
    const id = req.params.userRef
    Preference.find({ userRef: id }).populate("cuisineRef")
        .then((preferences) => {
            if (preferences.length === 0) {
                res.json({ error: "preference doesn't exist" })
            } else {
                res.json(preferences[0])
            }
        })
}

module.exports = preferenceController