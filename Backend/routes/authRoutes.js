const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/signup', authController.registerUser);

router.post('/login', authController.loginUser);

router.post('/logout', authController.logoutUser);

router.get('/verify', verifyJWT(), (req, res) => {
    res.status(200).json({
        userId: req.userId,
        userName: req.userName,
        role: req.role,
    });
});

module.exports = router;