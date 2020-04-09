import { Request, Response, NextFunction } from 'express';
import adminUsersService from '../../services/admin/adminUsersService';

const usersController: any = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await adminUsersService(res);
        return res.json(data);
    } catch (error) {
        return next(error);
    }
};

export default usersController;
