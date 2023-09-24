/*****************************************************/
/* CREATED AND DEVELOPED BY VIPINKUMAR KP */
/*****************************************************/
const express = require('express')
const router = express.Router()
const assetController = require("./assetController");

router.get('/get_asset', assetController.getAssets)
router.post('/add_asset',assetController.addAsset)

module.exports = router