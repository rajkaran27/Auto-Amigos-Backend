const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');
//Raj and Lexuan

router.get('/getCarBrands', carController.getCarBrands);
router.get('/getCars/:condition', carController.getCarsByCondition);
router.get('/getRecommendedNewCar', carController.getRecommendedNewCar);
router.get('/getCategory', carController.getCategory);
router.get('/getCarCapacity', carController.getCarCapacity);
router.get('/getCarTrans', carController.getCarTrans);
router.get('/getCar/:id', carController.getCarByID);
router.post('/getFilteredCars', carController.getCarsByFilter);
router.post('/createBrand', carController.createBrand);

router.post('/uploadCar', carController.uploadCar);
router.get('/getListedCarsUsingID/:id', carController.getListedCarsUsingID);
router.get('/getCarDetails/:id', (req, res) => {
    carController.getCarByID2(req, res)
        .then(data => res.json(data))
        .catch(error => res.status(500).json(error));
});
router.put('/updateCarUser', carController.updateCarUser);
router.get('/checkCarUser/:id/:user', carController.checkUserCar);
router.delete('/deleteCarUser/:id', carController.deleteCarUser);
router.get('/searchCars/:search', carController.getSearchedCar);


module.exports = router;