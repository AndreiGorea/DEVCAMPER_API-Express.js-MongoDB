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
const ErrorResponse = require('../utils/errorResponse');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');
// @desc  Get courses
// @route Get /api/v1/courses
// @route Get /api/v1/bootcamps/:bootcampId/courses
// @access Public
exports.getCourses = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.bootcampId) {
        const courses = yield Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        });
    }
    else {
        res.status(200).json(res.advancedResults);
    }
}));
// @desc  Get single course
// @route Get /api/v1/courses/:id
// @access Public
exports.getCourse = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    });
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    res.status(200).json({
        success: true,
        data: course
    });
}));
// @desc  Add course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private
exports.addCourse = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.body.bootcamp = req.params.bootcampId;
    req.body.user = req.user.id;
    const bootcamp = yield Bootcamp.findById(req.params.bootcampId);
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`, 404));
    }
    // Make sure user is course owner
    // @ts-ignore
    if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to add a course to bootcamp ${bootcamp._id}`, 401));
    }
    const course = yield Course.create(req.body);
    res.status(200).json({
        success: true,
        data: course
    });
}));
// @desc  Update course
// @route PUT /api/v1/courses/:id
// @access Private
exports.updateCourse = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let course = yield Course.findByIdAndUpdate(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`, 404));
    }
    // Make sure user is course owner
    // @ts-ignore
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to update course ${course._id}`, 401));
    }
    course = yield Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });
    res.status(200).json({
        success: true,
        data: course
    });
}));
// @desc  Update course
// @route DELETE /api/v1/courses/:id
// @access Private
exports.deleteCourse = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield Course.findByIdAndDelete(req.params.id);
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.user.id}`, 404));
    }
    // Make sure user is course owner
    // @ts-ignore
    if (course.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return next(new ErrorResponse(`User ${req.user.id} is not authorized to delete course ${course._id}`, 401));
    }
    yield course.remove();
    res.status(200).json({
        success: true,
        data: {}
    });
}));
