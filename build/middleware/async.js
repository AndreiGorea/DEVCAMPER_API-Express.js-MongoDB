"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const asyncHandler = (fn) => (req, res, next) => mongoose_1.Promise.resolve(fn(req, res, next)).catch(next);
module.exports = asyncHandler;
