const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/getReviewController');
const postReviewController = require('../controllers/postReviewController');
const deleteReviewController = require('../controllers/deleteReviewController');
const updateReviewController = require('../controllers/updateReviewController');
const { ro } = require('date-fns/locale');

// pranjal

// Create
router.post('/postReview/:id', postReviewController.postReview);
// Read
router.get('/getReview/:id', reviewController.getReviewByID);
router.get('/getReviewByUserID', reviewController.getReviewByUserID);
router.get('/getReviewByRating', reviewController.getReviewByRating);
router.get('/ReviewCheck/:carid/:userid', reviewController.ReviewCheck);
// Update
router.put('/updateReview/:id', updateReviewController.updateReview);
// Delete
router.delete('/deleteReview', deleteReviewController.deleteReview);


module.exports = router;