/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const router = express.Router()
const employeeController = require("./employeeController");

router.get('/get_all_employees', employeeController.getAllEmployees);
router.post('/add_user', employeeController.addEmployee)
router.post('/update_emp_status', employeeController.updateEmployeeStatus)

module.exports = router