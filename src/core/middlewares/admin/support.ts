import { Request, Response, NextFunction } from 'express';

const supportPermit = (req: Request, res: Response, next: NextFunction): any => {
    if (res.locals.user.roleId > 4) {
        return res.status(403).json({
            success: false,
            error: true,
            message: 'Access Denied.'
        });
    }
    return next();
};

export default supportPermit;
