/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const router = express.Router()
const userController = require('./authController')

router.post('/login', userController.loginUser)
router.post('/forgot_password', userController.forgetPassword)
router.post('/change_password', userController.changePassword)

module.exports = router