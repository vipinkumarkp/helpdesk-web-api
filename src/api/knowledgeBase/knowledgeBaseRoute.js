/*****************************************************/
/* CREATED AND DEVELOPED BY VIPINKUMAR KP */
/*****************************************************/
const express                  = require('express')
const router                   = express.Router()
const knowledge_BaseController = require("./knowledgeBaseController");

router.get('/get_knowledge_Base', knowledge_BaseController.getKnowledge_Bases)
router.post('/add_knowledge_Base',knowledge_BaseController.addKnowledge_Base)

module.exports = router