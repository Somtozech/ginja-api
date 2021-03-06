import { Request, Response, NextFunction } from 'express';
import loginAuthService from '../../services/admin/loginAuthService';

const loginAuthController: any = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await loginAuthService(res, req.body);
        return data;
    } catch (error) {
        return next(error);
    }
};

export default loginAuthController;
