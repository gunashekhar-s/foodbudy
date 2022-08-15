const moment = require("moment")
const Menu = require("../models/menu")
const Restaurant = require("../models/restaurant")
const Preference = require("../models/preference")

const menuController = {}

menuController.create = (req, res) => {
    const body = req.body

    if (!body.menuDate) {
        res.json({ error: "menu date is required" })
    }
    else {
        Restaurant.findById(body.restaurantId)
            .then((restaurant) => {
                if (!restaurant) {
                    res.json({ error: "please check restaurant id" })
                } else {
                    const accepting = restaurant.mealSessions[body.mealSession].accepting
                    if (!accepting) {
                        res.json({ error: "meal session disabled for creating menu" })
                    } else {

                        //checking if menu already exists for same date and meal
                        Menu.find({ menuDate: new Date(body.menuDate), mealSession: body.mealSession, isVeg: body.isVeg })
                            .then((menu) => {
                                if (menu.length > 0) {
                                    res.json({ error: "menu already exists" })
                                } else {
                                    const newMenu = new Menu(body)
                                    //if menu date is next day or onwards
                                    if (moment(body.menuDate).isAfter(moment().format('YYYY-MM-DD'))) {
                                        newMenu.save()
                                            .then((menu) => {
                                                res.json({ message: "menu created", menu: menu })
                                            })
                                            .catch((err) => {
                                                res.json(err)
                                            })
                                    } else if (moment(body.menuDate).isSame(moment().format('YYYY-MM-DD'))) { //if menu date is current date

                                        const startTime = restaurant.mealSessions[body.meals].start.split(":")
                                        const currentTime = String(moment().format("H:m")).split(":")

                                        //checking whether the current time is before meals time to make sure not creating menu for past menus
                                        if (Number(startTime[0]) - Number(currentTime[0]) > 0) {
                                            newMenu.save()
                                                .then((menu) => {
                                                    res.json({ message: "menu created", menu: menu })
                                                })
                                                .catch((err) => {
                                                    res.json(err)
                                                })
                                        }
                                        //if creating in same hour, checking minutes whether satisfy the BEFORE condition  
                                        else if ((Number(startTime[0]) - Number(currentTime[0]) === 0) && (Number(startTime[1]) - Number(currentTime[1]) > 0)) {
                                            newMenu.save()
                                                .then((menu) => {
                                                    res.json({ message: "menu created", menu: menu })
                                                })
                                                .catch((err) => {
                                                    res.json(err)
                                                })
                                        }
                                        //if menu date is in past dates/time
                                        else {
                                            res.json({ error: "cannot create menu for past time" })
                                        }
                                    }
                                    //if menu date is in past dates
                                    else {
                                        res.json({ error: "cannot create menu for past date/time" })
                                    }

                                }
                            })
                            .catch((err) => {
                                res.json(err)
                            })
                    }
                }
            })
            .catch((err) => {
                res.json(err)
            })
    }
}


menuController.showAll = (req, res) => {
    Menu.find()
        .then((menus) => {
            res.json(menus)
        })
        .catch((err) => {
            res.json(err)
        })
}

menuController.show = (req, res) => {
    const id = req.params.menuId
    Menu.findById(id)
        .then((menu) => {
            if (!menu) {
                res.json({ error: "invalid menu id" })
            } else {
                res.json(menu)
            }
        })
}

menuController.remove = (req, res) => {
    const id = req.params.menuId
    const body = req.body
    Menu.findById(id)
        .then((newMenu) => {
            if (!newMenu) {
                res.json({ error: "invalid menu id" })
            } else {
                Restaurant.findById(body.restaurantId)
                    .then((restaurant) => {
                        if (!restaurant) {
                            res.json({ error: "please check restaurant id" })
                        } else {
                            const remover = () => {
                                Menu.findByIdAndDelete(id)
                                    .then((menu) => {
                                        if (!menu) {
                                            res.json({ error: "invalid menu id" })
                                        } else {
                                            res.json({ message: "menu removed", _id: menu._id })
                                        }
                                    }
                                    )
                                    .catch((err) => {
                                        res.json(err)
                                    })
                            }
                            //if menu date is next day or onwards

                            if (moment(newMenu.menuDate).isAfter(moment().format('YYYY-MM-DD'))) {
                                remover()
                            }
                            //if menu date is current date
                            else if (moment(newMenu.menuDate).isSame(moment().format('YYYY-MM-DD'))) {

                                // const startTime = restaurant[newMenu.meals].start.split(":")
                                const startTime = restaurant.mealSessions[body.meals].start.split(":")
                                const currentTime = String(moment().format("H:m")).split(":")

                                //checking whether the current time is before meals time to make sure not deleting past menus
                                if ((Number(startTime[0]) - Number(currentTime[0]) >= 0) && (Number(startTime[1]) - Number(currentTime[1]) > 0)) {
                                    remover()
                                }
                                //if menu date is in past time
                                else {
                                    res.json({ error: "cannot delete menu for past date/time" })
                                }
                            }
                            //if menu date is in past dates
                            else {
                                res.json({ error: "cannot delete menu for past date/time" })
                            }

                        }
                    })
            }
        })
        .catch((err) => {
            res.json(err)
        })
}

menuController.update = (req, res) => {
    const body = req.body
    const id = req.params.menuId

    if (!body.menuDate) {
        res.json({ error: "menu date is required" })
    } else if (!body.cuisineRef) {
        res.json({ error: "cuisineRef id is required" })
    } else if (typeof body.isVeg !== "boolean") {
        res.json({ error: "isVeg boolean value is required" })
    } else {

        // need to decide whether to use id or just restaurant[0] from Restaurant.find()
        Restaurant.findById(body.restaurantId)
            .then((restaurant) => {
                if (!restaurant) {
                    res.json({ error: "please check restaurant id" })
                } else {
                    const updator = () => {
                        Menu.find({ _id: { $ne: id }, menuDate: new Date(body.menuDate), mealSession: body.mealSession, cuisineRef: body.cuisineRef, isVeg: body.isVeg })
                            .then((menus) => {
                                if (menus.length === 0) {
                                    res.json({ error: "menu doesn't exist" })
                                } else {
                                    Menu.findByIdAndUpdate(id, body, { runValidators: true, new: true })
                                        .then((menu) => {
                                            if (!menu) {
                                                res.json({ error: "invalid menu id" })
                                            } else {
                                                res.json({ message: "menu updated", menu: menu })
                                            }
                                        })
                                }
                            }
                            )
                            .catch((err) => {
                                res.json(err)
                            })
                    }
                    //if menu date is next day or onwards

                    if (moment(body.menuDate).isAfter(moment().format('YYYY-MM-DD'))) {

                        updator()
                    }
                    //if menu date is current date
                    else if (moment(body.menuDate).isSame(moment().format('YYYY-MM-DD'))) {

                        // const startTime = restaurant[body.meals].start.split(":")
                        const startTime = restaurant.mealSessions[body.meals].start.split(":")
                        const currentTime = String(moment().format("H:m")).split(":")

                        //checking whether the current time is before meals time to make sure not updating menu for past menus
                        if (Number(startTime[0]) - Number(currentTime[0]) > 0) {
                            updator()
                        }
                        //if updating in same hour, checking minutes whether satisfy the BEFORE condition  
                        else if ((Number(startTime[0]) - Number(currentTime[0]) === 0) && (Number(startTime[1]) - Number(currentTime[1]) > 0)) {
                            updator()
                        }
                        //if menu date is in past time
                        else {
                            res.json({ error: "cannot update menu for past date/time" })
                        }
                    }
                    //*if menu date is in past dates
                    else {
                        res.json({ error: "cannot update menu for past date/time" })
                    }

                }
            })
            .catch((err) => {
                res.json(err)
            })
    }
}

menuController.filterByDateRange = (req, res) => {
    const body = req.body
    const startDate = body.startDate
    const endDate = body.endDate
    if (!startDate || !endDate) {
        res.json({ error: "start date and end date must be provided" })
    }
    //checking recieved inputs are in required format
    else if (!isDate(startDate, { strictMode: true, format: "YYYY-MM-DD" }) || !isDate(endDate, { strictMode: true, format: "YYYY-MM-DD" })) {
        res.json({ error: "invalid start/end date format, dates must be in the format YYYY-MM-DD" })
    }
    //checking whether start date exceeds end date
    else if (moment(startDate).isAfter(endDate)) {
        res.json({ error: "start date cannot be after end date" })
    }
    else {
        Menu.find({
            menuDate: {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            }
        })
            .then((menus) => {
                res.json(menus)
            })
            .catch((err) => {
                es.jsn(err)
            })
    }

}


menuController.getSevenDaysMenu = (req, res) => {
    const preferenceId = req.params.preferenceId

    Preference.findById(preferenceId)
        .then((preference) => {
            if (!preference) {
                res.json({ error: "Invalid preferenceId" })

            } else {

                const startDate = moment().format("YYYY-MM-DD")
                const endDate = moment().add(7, "days").format("YYYY-MM-DD")
                const dates = []

                Menu.find({
                    menuDate: {
                        $gte: new Date(startDate),
                        $lte: new Date(endDate)
                    },
                    mealSessions: { $in: preference.mealSessions },
                    cuisineRef: preference.cuisineRef,
                }).populate("cuisineRef").populate({ path: "comboRef", populate: "categories.items.itemRef" })
                    .then((menus) => {

                        const menuList = []
                        for (let i = 0; i < 7; i++) {
                            const day = moment().add(i, "days").format("dddd")
                            dates.push({ date: moment().add(i, "days").format("YYYY-MM-DD"), day })
                            for (let j = 0; j < preference.mealSessions.length; j++) {
                                menuList.push({
                                    date: moment().add(i, "days").format("YYYY-MM-DD"),
                                    day,
                                    mealSession: preference.mealSessions[j],
                                    isVeg: preference.vegDays.includes(day)
                                })
                            }
                        }
                        const newMenuList = menuList.map(ele => {
                            const item = menus.find(menu => {
                                return (ele.date === moment(menu.menuDate).format("YYYY-MM-DD") && ele.mealSession === menu.mealSession && ele.isVeg === menu.isVeg)
                            })

                            const newItem = { ...ele, ...(!item ? { status: "not created" } : { menuData: item }) }
                            return newItem
                        })

                        res.json({ dates, newMenuList })
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
module.exports = menuController