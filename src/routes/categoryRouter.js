const express = require("express")
const router = express.Router()
const categoryCtrl = require("../controllers/categoryCtrl")



router.get("/category", categoryCtrl.getListCategory)
router.post("/category", categoryCtrl.create)
router.delete("/category/:id", categoryCtrl.deleteCategory)
router.put("/category/:id", categoryCtrl.updateCategory)

module.exports = router