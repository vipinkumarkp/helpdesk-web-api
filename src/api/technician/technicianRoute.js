/*****************************************************/
/* CREATED AND DEVELOPED BY MANNMOHAN */
/*****************************************************/
const express = require('express')
const router = express.Router()
const technicianController = require('./technicianController')

router.get('/getProfile/:id', technicianController.getProfile),
router.get('/getMyTickets/:assignee', technicianController.getMyTickets)

module.exports = router