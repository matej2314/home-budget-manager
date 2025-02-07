const express = require('express');
const router = express.Router();
const logger = require('../configs/logger');
const { extractPhotoData } = require('../configs/tesseract');

router.post('/receipt', async (req, res) => {
    
})


module.exports = router;