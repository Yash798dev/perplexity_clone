const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chat.controller');
const { requireAuth } = require('../middleware/auth.middleware');

router.get('/', requireAuth, chatController.listSessions);
router.post('/', requireAuth, chatController.createSession);
router.delete('/:id', requireAuth, chatController.deleteSession);
router.get('/:id/messages', requireAuth, chatController.getMessages);
router.post('/:id/messages', requireAuth, chatController.sendMessage);

module.exports = router;
