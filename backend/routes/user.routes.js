const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/profile', requireAuth, userController.getProfile);
router.put('/profile', requireAuth, userController.updateProfile);
router.post('/onboarding', requireAuth, userController.completeOnboarding);

module.exports = router;
