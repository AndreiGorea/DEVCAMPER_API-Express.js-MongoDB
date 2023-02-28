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
const Bootcamp = require("../models/Bootcamp");
const advancedResults = (model, populate) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    // Copy req.query
    const reqQuery = Object.assign({}, req.query);
    // Fields to exclude that I do not want to be matched at filtering
    const removeFields = ['select', 'sort', 'page', 'limit'];
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    // Finding resource
    query = model.find(JSON.parse(queryStr));
    // Select Fields
    if (req.query.select) {
        const fields = req.query.select.split(',').join(' ');
        query = query.select(fields);
    }
    // Sort
    if (req.query.sort) {
        // @ts-ignore
        const sortBy = req.query.sort.split(',').join(' ');
        query = query.sort(sortBy);
    }
    else {
        query = query.sort('-createdAt');
    }
    // Pagination
    // @ts-ignore
    const page = parseInt(req.query.page) || 1;
    // @ts-ignore
    const limit = parseInt(req.query.limit) || 5;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = yield model.countDocuments();
    query = query.skip(startIndex).limit(limit);
    //If something is passed to populate we do this:
    if (populate) {
        query = query.populate(populate);
    }
    // Executing query
    const results = yield query;
    // Pagination result
    const pagination = {};
    if (endIndex < total) {
        // @ts-ignore
        pagination.next = {
            page: page + 1,
            limit
        };
    }
    if (startIndex > 0) {
        // @ts-ignore
        pagination.prev = {
            page: page - 1,
            limit
        };
    }
    res.advancedResults = {
        success: true,
        count: results.length,
        pagination,
        data: results
    };
    next();
});
module.exports = advancedResults;
