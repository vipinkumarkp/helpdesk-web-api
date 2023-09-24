/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const router = express.Router()
const userController = require('./userController')

router.get('/get_categories', userController.getCategories)
router.get('/get_sub_categories/:c_id', userController.getSubCategories)
router.get('/getMyTicket/:id', userController.getMyTickets)
router.post('/createTicket', userController.createTicket)
router.post('/chat_with', userController.sendChat)
router.get('/getChat/:ticket_id', userController.getChat)
router.get('/getProfile/:id', userController.getProfileDetails)

module.exports = router