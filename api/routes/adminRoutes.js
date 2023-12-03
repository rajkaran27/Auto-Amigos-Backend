const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController')
const adminAuthenticate = require("../../middleware/adminAuthenticate");


//raj
router.get('/getCar/:id', adminAuthenticate, (req, res) => {
    adminController.getCarByID(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json(error));
});
router.put('/updateCar', adminAuthenticate, adminController.updateCar);
router.delete('/deleteCar/:carId', adminAuthenticate, adminController.deleteCar)

module.exports = router