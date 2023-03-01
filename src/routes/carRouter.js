const express = require("express")
const router = express.Router()
const carCtrl = require("../controllers/carCtrl")



router.get("/car", carCtrl.getCars)
router.get("/car/search", carCtrl.searchCars)
router.post("/car", carCtrl.addCar)
router.delete("/car/:id", carCtrl.deleteCar)
router.put("/car/:id", carCtrl.updateCar)
router.get("/car/:id", carCtrl.getCarById)
router.get("/car/category/:categoryId", carCtrl.getCarsByCategory)

module.exports = router