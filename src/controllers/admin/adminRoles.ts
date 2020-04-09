import { Request, Response, NextFunction } from 'express';
import adminRoelsService from '../../services/admin/adminRolesService';

const adminRolesController: any = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await adminRoelsService(res);
        return res.json(data);
    } catch (error) {
        return next(error);
    }
};

export default adminRolesController;
