import {NextFunction} from "express";
import {Promise} from "mongoose";

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction)
    => Promise<void>) => (req: Request, res: Response, next: NextFunction) =>
    Promise.resolve(fn(req, res, next)).catch(next);

module.exports = asyncHandler;
