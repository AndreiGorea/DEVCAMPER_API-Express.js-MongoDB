// @ts-ignore
const jwt = require('jsonwebtoken');
// @ts-ignore
const asyncHandler = require('./async');
// @ts-ignore
const ErrorResponse = require('../utils/errorResponse');
// @ts-ignore
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req: any, res: any, next: any) => {
    let token;

    if (req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    // else if (req.cookies.token) {
    //     token = req.cookies.token;
    // }
    // console.log(req.cookies); here req.cookies is null

    // Make sure token exists
    if (!token) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
    try {
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.id);

        next();
    } catch (err) {
        return next(new ErrorResponse('Not authorized to access this route', 401));
    }
});

// Grant access to specific roles
exports.authorize = (...roles: any) => {
    return (req: any, res: any, next: any) => {
        if (!roles.includes(req.user.role)) {
            return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
        }
        next();
    }
}
