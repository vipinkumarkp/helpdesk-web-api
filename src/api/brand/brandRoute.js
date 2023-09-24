/*****************************************************/
/* CREATED AND DEVELOPED BY VIPINKUMAR KP */
/*****************************************************/
const express = require('express')
const router = express.Router()
const brandController = require("./brandController");

router.get('/get_brands',brandController.getBrands)
router.post('/add_brand', brandController.addBrand)
// router.post('/edit_brand', brandController.addBrand)

module.exports = router