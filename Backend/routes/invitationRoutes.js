const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const invitationController = require('../controllers/invitationController');
const verifyRole = require('../middlewares/verifyRole');

router.post('/accept', verifyRole('host'), invitationController.acceptInvitation);

router.post('/decline', verifyRole('host'), invitationController.rejectInvitation);

router.get('/collection', verifyRole('host'), invitationController.getInvitationsCollection);

module.exports = router;