//karl
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticate = require("../../middleware/authenticate");

router.post("/login", userController.loginUser);
router.post("/register", userController.registerUser);
router.get("/getUser/:userId", authenticate, userController.getUserById);
router.put("/updateProfile/:userId", authenticate, userController.updateProfile);
router.delete('/deleteUser/:id', authenticate, userController.deleteUser);


//raj
router.post('/saveAddress',authenticate, async (req, res) => {
    try {
        const result = await userController.saveUserAddress(req);
        res.status(200).json({
            message: result ? 'Address updated successfully' : 'Address inserted successfully',
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getAddress/:userId',authenticate, async (req, res) => {
    try {
        const result = await userController.getUserAddress(req);

        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Address not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});
module.exports = router;
