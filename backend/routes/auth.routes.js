const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/google', authController.googleSignIn);
router.get('/me', requireAuth, authController.me);

module.exports = router;
