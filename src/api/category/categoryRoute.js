/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const router = express.Router()
const categoryController = require("./categoryController");

router.get('/get_categories',categoryController.getCategories)
router.get('/get_sub_categories/:c_id', categoryController.getSubCategories)
router.post('/add_category', categoryController.addCategory)
router.post('/add_sub_category', categoryController.addSubCategory)

module.exports = router