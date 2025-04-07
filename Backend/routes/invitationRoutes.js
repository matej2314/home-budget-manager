const express = require('express');
const router = express.Router();
const pool = require('../database/db');
const invitationController = require('../controllers/invitationController');
const verifyRole = require('../middlewares/verifyRole');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/accept', verifyJWT, verifyRole('host'), invitationController.acceptInvitation);

router.post('/decline', verifyJWT, verifyRole('host'), invitationController.rejectInvitation);

router.get('/collection', verifyJWT, verifyRole('host'), invitationController.getInvitationsCollection);

module.exports = router;