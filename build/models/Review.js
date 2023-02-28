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
// @ts-ignore
const mongoose = require('mongoose');
const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add some text']
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a rating between 1 and 10']
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});
// Static method to get average rating and save
// @ts-ignore
ReviewSchema.statics.getAverageRating = function (bootcampId) {
    return __awaiter(this, void 0, void 0, function* () {
        const obj = yield this.aggregate([
            {
                $match: { bootcamp: bootcampId }
            },
            {
                $group: {
                    _id: '$bootcamp',
                    averageRating: { $avg: '$rating' }
                }
            }
        ]);
        try {
            yield this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
                averageRating: obj[0].averageRating
            });
        }
        catch (err) {
            console.error(err);
        }
    });
};
// Call getAverageCost after save
ReviewSchema.post('save', function () {
    // @ts-ignore
    this.constructor.getAverageRating(this.bootcamp);
});
// Call getAverageCost before remove
ReviewSchema.pre('remove', function () {
    // @ts-ignore
    this.constructor.getAverageRating(this.bootcamp);
});
// Prevent user from submitting more than 1 review per bootcamp
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });
module.exports = mongoose.model('Review', ReviewSchema);
