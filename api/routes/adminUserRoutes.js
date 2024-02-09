//karl
const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");
const userController = require("../controllers/userController");
const adminAuthenticate = require("../../middleware/adminAuthenticate");

router.get("/getAllUsers", adminUserController.getAllUsers);
router.get("/getAll", adminUserController.getAll);
router.get("/getUser/:userId", userController.getUserById);
router.put("/updateProfile/:userId", adminUserController.updateProfile);

module.exports = router;
