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
const path = require('path');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const Bootcamp = require('../models/Bootcamp');
const geocoder = require('../utils/geocoder');
// @desc  Get all bootcamps
// @route Get /api/v1/bootcamps
// @access Public
exports.getBootcamps = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.status(200).json(res.advancedResults);
}));
// @desc  Get single bootcamp
// @route Get /api/v1/bootcamps/:id
// @access Public
exports.getBootcamp = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    res.status(200).json({ success: true, data: bootcamp });
}));
// @desc  Create new bootcamp
// @route Post /api/v1/bootcamps
// @access Private
exports.createBootcamp = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Add user to req.body
    req.body.user = req.user.id;
    // Check for published bootcamp
    const publishedBootcamp = yield Bootcamp.findOne({ user: req.user.id });
    // If the user is not an admin, they can only add one bootcamp
    if (publishedBootcamp && req.user.role !== 'admin') {
        return next(new ErrorResponse(`The user with ID ${req.user.id} has already published a bootcamp`, 400));
    }
    const bootcamp = yield Bootcamp.create(req.body);
    res.status(201).json({
        success: true,
        data: bootcamp
    });
}));
// @desc  Update bootcamp
// @route Put /api/v1/bootcamps:id
// @access Private
exports.updateBootcamp = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let bootcamp = yield Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is bootcamp owner
    // @ts-ignore
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }
    bootcamp = yield Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({ success: true, data: bootcamp });
}));
// @desc  Delete bootcamp
// @route Delete /api/v1/bootcamps:id
// @access Private
exports.deleteBootcamp = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is bootcamp owner
    // @ts-ignore
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to delete this bootcamp`, 401));
    }
    bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
}));
// @desc  Get bootcamps within a radius
// @route GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access Private
exports.getBootcampsInRadius = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { zipcode, distance } = req.params;
    // Get lat/lng from geocoder
    const loc = yield geocoder.geocode(zipcode);
    const lat = loc[0].latitude;
    const lng = loc[0].longitude;
    // Calc radius using radians
    // Divide dist by  radius of Earth
    // Earth Radius = 3,963 mi / 6,378 km
    // @ts-ignore
    const radius = distance / 3963;
    const bootcamps = yield Bootcamp.find({
        location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } }
    });
    res.status(200).json({
        success: true,
        count: bootcamps.length,
        data: bootcamps
    });
}));
// @desc  Upload photo for bootcamp
// @route PUT /api/v1/bootcamps/:id/photo
// @access Private
exports.bootcampPhotoUpload = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bootcamp = yield Bootcamp.findById(req.params.id);
    if (!bootcamp) {
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
    }
    // Make sure user is bootcamp owner
    // @ts-ignore
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.params.id} is not authorized to update this bootcamp`, 401));
    }
    // @ts-ignore
    if (!req.files) {
        return next(new ErrorResponse('Please upload a file', 400));
    }
    // res.status(200).json({
    //     success: true,
    //     count: bootcamps.length,
    //     data: bootcamps
    // });
    // @ts-ignore
    const file = req.files.file;
    // Make sure the image is a photo
    if (!file.mimetype.startsWith('image')) {
        return next(new ErrorResponse('Please upload an image file', 400));
    }
    // Check file size
    // @ts-ignore
    if (file.size > process.env.MAX_FILE_UPLOAD) {
        return next(new ErrorResponse(`Please upload an image size less than ${process.env.MAX_FILE_UPLOAD}`, 400));
    }
    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    // Upload file
    // @ts-ignore
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            console.log(err);
            return next(new ErrorResponse(`Problem with file upload`, 500));
        }
        yield Bootcamp.findByIdAndUpdate(req.params.id, { photo: file.name });
        res.status(200).json({
            success: true,
            data: file.name
        });
    }));
    console.log(file.name);
}));
