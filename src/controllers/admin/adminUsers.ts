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
    },
    deleteAdmin: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminUsersService.deleteAdmin(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    updatePassword: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminUsersService.updatePassword(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default adminUsersController;
