import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../../prisma/generated/index';

const auth = (req: Request, res: Response, next: NextFunction): any => {
    const token = req.header('x-admin-auth');
    if (!token)
        return res.status(401).json({
            success: false,
            error: true,
            message: 'Access denied! No token provided.'
        });
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRETE);
        res.locals.prisma = prisma;
        res.locals.user = decode;
        return next();
    } catch (err) {
        res.status(400).json({
            success: false,
            error: true,
            message: 'Invald Token.'
        });
        return next(err);
    }
};

export default auth;
