import { Request, Response, NextFunction } from 'express';
import adminRolesService from '../../services/admin/adminRolesService';

const adminRolesController: any = {
    allRoles: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminRolesService.getRoles(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    createRole: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminRolesService.createRole(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    deleteRole: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await adminRolesService.deleteRole(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default adminRolesController;
