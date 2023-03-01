const express = require("express")
const router = express.Router()
const proCtrl = require("../controllers/proccCtrl")



router.post("/proccess", proCtrl.getRentCar)
router.post("/proccess/give/:proccessId", proCtrl.giveBackCar)


module.exports = router