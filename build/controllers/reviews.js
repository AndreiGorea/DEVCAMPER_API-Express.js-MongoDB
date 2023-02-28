"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = require('../middleware/async');
// @ts-ignore
const ErrorResponse = require('../utils/errorResponse');
const Review = require('../models/Review');
// @ts-ignore
const Bootcamp = require('../models/Bootcamp');
// @desc  Get reviews
// @route Get /api/v1/reviews
// @route Get /api/v1/bootcamps/:bootcampId/reviews
// @access Public
exports.getReviews = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.bootcampId) {
        const reviews = yield Review.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
}));
// @desc  Get single review
// @route GET /api/v1/reviews/:id
// @access Public
exports.getReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!review) {
        return next(new ErrorResponse(`No review found with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: review
    });
}));
// @desc  Add review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private
exports.addReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = yield Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }
    const review = yield Review.create(req.body);
    res.status(201).json({
        success: true,
        data: review
    });
}));
// @desc  Update review
// @route PUT /api/v1/reviews/:id
// @access Private
exports.updateReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let review = yield Review.findByIdAndUpdate(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to update review`, 401));
    }
    review = yield Review.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: review
    });
}));
// @desc  Delete review
// @route DELETE /api/v1/reviews/:id
// @access Private
exports.deleteReview = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield Review.findByIdAndDelete(req.params.id);
    if (!review) {
        return next(new ErrorResponse(`No review with the id of ${req.params.id}`, 404));
    }
    // Make sure review belongs to user or user is admin
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`Not authorized to delete review`, 401));
    }
    yield review.remove();
    res.status(200).json({
        success: true,
        data: {}
    });
}));
