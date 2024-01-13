const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");

router.get('/retrieveAllChats/:userId', chatController.retrieveAllChats);

router.post("/startChat", chatController.startChat);
router.post("/sendMessage", chatController.sendMessage);
module.exports = router;