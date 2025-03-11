const express = require('express');
const router = express.Router();
const verifyJWT = require('../middlewares/verifyJWT');
const noticeController = require('../controllers/notificationController');

router.get('/collection', verifyJWT, noticeController.GetNoticesCollection);

router.delete('/:noticeId', noticeController.deleteNotification);