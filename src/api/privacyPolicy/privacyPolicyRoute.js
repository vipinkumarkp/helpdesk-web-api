/*****************************************************/
/* CREATED AND DEVELOPED BY VIPINKUMAR KP */
/*****************************************************/
const express                  = require('express')
const router                   = express.Router()
const privacyPolicyController  = require("./privacyPolicyController");

router.get('/get_privacy_Policy', privacyPolicyController.getPrivacyPolicies)
router.post('/add_privacy_Policy',privacyPolicyController.addPrivacyPolicy)

module.exports = router