import { Request, Response, NextFunction } from 'express';
import adminUsersService from '../../services/admin/adminUsersService';

const adminUsersController = {
    getAdmins: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminUsersService.getAdmins(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    createAdmin: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminUsersService.createAdmin(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default adminUsersController;
