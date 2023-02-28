const ErrorResponse = require('../utils/errorResponse');
import {NextFunction, Response} from "express";
// type MyError = Error & { statusCode?: number, value?: any };

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    let error = { ...err }

    error.message = err.message;

    // Log to console for dev
    console.log(err);

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found with id of ${err.value}`;
        error = new ErrorResponse(message, 404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
       const message =  'Duplicate field value entered';
       error = new ErrorResponse(message, 400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const errors: { [key: string]: any } = err.errors;
        const message = Object.values(errors).map(val => val.message);
        error = new ErrorResponse(message, 400);
    }

    res.status(error.statusCode || 500).json({
        success: false,
        error: error.message || 'Server Error',
    });
}

module.exports = errorHandler;
