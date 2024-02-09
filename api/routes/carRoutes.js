const express = require("express");
const router = express.Router();
const carController = require("../controllers/carController");
//Raj and Lexuan

router.get("/getCarBrands", carController.getCarBrands);
router.get("/getCars/:condition", carController.getCarsByCondition);
router.get("/getRecommendedNewCar", carController.getRecommendedNewCar);
router.get("/getCategory", carController.getCategory);
router.get("/getCarCapacity", carController.getCarCapacity);
router.get("/getCarTrans", carController.getCarTrans);
router.get("/getCar/:id", carController.getCarByID);
router.get("/getListedCarsUsingID/:id", carController.getListedCarsUsingID);
router.get("/getCarDetails/:id", (req, res) => {
  carController
    .getCarByID2(req, res)
    .then((data) => res.json(data))
    .catch((error) => res.status(500).json(error));
});

router.get(
  "/getRentalRecordByUserID/:id",
  carController.getRentalRecordByUserID
);
router.get("/checkCarUser/:id/:user", carController.checkUserCar);
router.get("/searchCars/:search", carController.getSearchedCar);
router.get("/getCarByQuiz", carController.getCarByQuiz);
router.get("/getUserIdByCarId/:carId", carController.getCarSellerByCarID);

router.get("/getTopRenteeInfo", async (req, res) => {
  try {
    const result = await carController.getTopRenteeInfo(req);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getTopRentedCar", async (req, res) => {
  try {
    const result = await carController.getTopRentedCar(req);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});
router.get("/getAllUserRental", async (req, res) => {
  try {
    const result = await carController.getAllUserRental(req);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/getAllRentedCar", async (req, res) => {
  try {
    const result = await carController.getAllRentedCar(req);
    res.status(200).send(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/UploadRentalRecord", carController.UploadRentalRecord);
router.post("/getFilteredCars", carController.getCarsByFilter);
router.post("/createBrand", carController.createBrand);
router.post("/uploadCar", carController.uploadCar);
router.post("/uploadingImage", carController.uploadingImage);

router.put("/updateCarUser", carController.updateCarUser);
router.delete("/deleteCarUser/:id", carController.deleteCarUser);
router.delete(
  "/deleteRentalRecord/:id/:car_id",
  carController.deleteRentalRecord
);

module.exports = router;
