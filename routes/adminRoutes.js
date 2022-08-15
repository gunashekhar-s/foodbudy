const express = require("express")
const categoryController = require("../app/controllers/categoryController")
const cuisineController = require("../app/controllers/cuisineController")
const itemController = require("../app/controllers/itemController")
const restaurantController = require("../app/controllers/restaurantController")
const comboController = require("../app/controllers/comboController")
const { authenticateUser, authorizeUser } = require("../app/middlewares/authenticateUser")
const adminRouter = express.Router()
const upload = require("../app/middlewares/multer")
const menuController = require("../app/controllers/menuController")
const subscriptionPlanController = require("../app/controllers/subscriptionPlanController")


//restaurant routes
adminRouter.post("/restaurant", authenticateUser, authorizeUser, restaurantController.create)
adminRouter.get("/restaurant/:restaurantId", authenticateUser, authorizeUser, restaurantController.show)


//cuisine routes
adminRouter.post("/cuisine", authenticateUser, authorizeUser, upload.single("image"), cuisineController.create)
adminRouter.put("/cuisine/:cuisineId", authenticateUser, authorizeUser, upload.single("image"), cuisineController.update)
adminRouter.get("/cuisine/:cuisineId", authenticateUser, authorizeUser, cuisineController.show)
adminRouter.get("/cuisine", authenticateUser, authorizeUser, cuisineController.showAll)
adminRouter.delete("/cuisine/:cuisineId", authenticateUser, authorizeUser, cuisineController.remove)


//category routes
adminRouter.post("/category", authenticateUser, authorizeUser, categoryController.create)
adminRouter.get("/category", authenticateUser, authorizeUser, categoryController.showAll)
adminRouter.get("/category/:categoryId", authenticateUser, authorizeUser, categoryController.show)
adminRouter.put("/category/:categoryId", authenticateUser, authorizeUser, categoryController.update)
adminRouter.delete("/category/:categoryId", authenticateUser, authorizeUser, categoryController.remove)


//item routes
adminRouter.post("/item", authenticateUser, authorizeUser, itemController.create)
adminRouter.get("/item", authenticateUser, authorizeUser, itemController.showAll)
adminRouter.get("/item/:itemId", authenticateUser, authorizeUser, itemController.show)
adminRouter.put("/item/:itemId", authenticateUser, authorizeUser, itemController.update)
adminRouter.delete("/item/:itemId", authenticateUser, authorizeUser, itemController.remove)
adminRouter.get("/filterItems", authenticateUser, authorizeUser, itemController.filteredItems)


//combos
adminRouter.post("/combo", authenticateUser, authorizeUser, comboController.create)
adminRouter.get("/combo", authenticateUser, authorizeUser, comboController.showAll)
adminRouter.get("/combo/:comboId", authenticateUser, authorizeUser, comboController.show)
adminRouter.put("/combo/:comboId", authenticateUser, authorizeUser, comboController.update)
adminRouter.delete("/combo/:comboId", authenticateUser, authorizeUser, comboController.remove)
adminRouter.get("/filtercombos", authenticateUser, authorizeUser, comboController.filterComboByIsVegAndCuisine)


//menus
adminRouter.post("/menu", authenticateUser, authorizeUser, menuController.create)
adminRouter.get("/menu", authenticateUser, authorizeUser, menuController.showAll)
adminRouter.get("/menu/:menuId", authenticateUser, authorizeUser, menuController.show)
adminRouter.put("/menu/:menuId", authenticateUser, authorizeUser, menuController.update)
adminRouter.delete("/menu/:menuId", authenticateUser, authenticateUser, menuController.remove)
adminRouter.get("/menufilter/range", authenticateUser, authenticateUser, menuController.filterByDateRange)


//subscription plan routes
adminRouter.post("/subscriptionplan", authenticateUser, authorizeUser, subscriptionPlanController.create)
adminRouter.get("/subscriptionplan/:subscriptionplanId", authenticateUser, authorizeUser, subscriptionPlanController.show)
adminRouter.get("/subscriptionplan", authenticateUser, authorizeUser, subscriptionPlanController.showAll)
adminRouter.put("/subscriptionplan/:subscriptionplanId", authenticateUser, authorizeUser, subscriptionPlanController.update)
adminRouter.delete("/subscriptionplan/:subscriptionplanId", authenticateUser, authorizeUser, subscriptionPlanController.remove)

module.exports = adminRouter