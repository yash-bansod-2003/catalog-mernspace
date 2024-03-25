import { Request, Response, NextFunction, RequestHandler } from "express";

const asyncWrapper = <T>(
    requestHandler: (
        req: Request,
        res: Response,
        next: NextFunction,
    ) => Promise<T>,
): RequestHandler => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await requestHandler(req, res, next);
        } catch (error) {
            next(error);
        }
    };
};

export { asyncWrapper };
