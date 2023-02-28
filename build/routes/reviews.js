"use strict";
// @ts-ignore
const express = require('express');
// We are merging url params when we create courseRouter
// @ts-ignore
const router = express.Router({ mergeParams: true });
// @ts-ignore
const advancedResults = require('../middleware/advancedResults');
// @ts-ignore
const { protect, authorize } = require('../middleware/auth');
const { getReviews, getReview, addReview, updateReview, deleteReview } = require('../controllers/reviews');
// @ts-ignore
const Review = require('../models/Review');
router
    .route('/')
    .get(advancedResults(Review, {
    path: 'bootcamp',
    select: 'name description'
}), getReviews)
    .post(protect, authorize('user', 'admin'), addReview);
router
    .route('/:id')
    .get(getReview)
    .put(protect, authorize('user', 'admin'), updateReview)
    .delete(protect, authorize('user', 'admin'), deleteReview);
module.exports = router;
