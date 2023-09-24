/*****************************************************/
/* CREATED AND DEVELOPED BY VIPINKUMAR KP */
/*****************************************************/
const express = require('express')
const router = express.Router()
const departmentController = require("./departmentController");

router.get('/get_department', departmentController.getDepartments)
router.post('/add_department',departmentController.addDepartment)

module.exports = router