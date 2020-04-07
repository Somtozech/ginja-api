import { Request, Response, NextFunction } from 'express';
import { NotAuthenticatedError } from '../errors';
import { prisma } from '../prisma/generated/index';

const handleRestAuth = (req: Request, res: Response, next: NextFunction): any => {
    return new Promise((resolve, reject): any => {
        const { body, headers = {} } = req;
        const { Authorization = '' } = headers;

        const token = true;

        // add funtionality to validate auth token

        if (token) {
            res.locals.prisma = prisma;
            resolve(req);
        } else {
            reject(new NotAuthenticatedError('no authorization token found'));
        }
    })
        .then((): any => {
            next();
        })
        .catch((err: Error): any => next(err));
};

export default handleRestAuth;
