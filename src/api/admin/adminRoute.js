/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const router = express.Router()

const adminController = require('./adminController')

router.get('/get_all_members', adminController.getMembers)
router.get('/get_all_admins', adminController.getAdmins),
router.post('/add_members', adminController.createStaff)

module.exports = router