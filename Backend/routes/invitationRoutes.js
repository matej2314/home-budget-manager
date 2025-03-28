const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const invitationController = require('../controllers/invitationController');

router.post('/accept', invitationController.acceptInvitation);

router.post('/decline', invitationController.declineInvitation);

module.exports = router;