//karl
const express = require("express");
const router = express.Router();
const adminUserController = require("../controllers/adminUserController");
const userController = require("../controllers/userController");
const adminAuthenticate = require("../../middleware/adminAuthenticate");

router.get("/getAllUsers", adminAuthenticate, adminUserController.getAllUsers);
router.get("/getUser/:userId", adminAuthenticate, userController.getUserById);
router.put("/updateProfile/:userId", adminAuthenticate, adminUserController.updateProfile);

// router.get("/getUser", adminUserController.getUser);
// router.post("/login", adminUserController.loginUser);
// router.post("/register", adminUserController.registerUser);
// router.get("/getUser/:userId", authenticate, adminUserController.getUserById);
// router.put("/updateProfile/:userId", authenticate, adminUserController.updateProfile);

// //raj
// router.post('/saveAddress', adminUserController.saveUserAddress);

module.exports = router;
