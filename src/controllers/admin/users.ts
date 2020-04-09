import { Request, Response, NextFunction } from 'express';
import usersService from '../../services/admin/usersService';

const usersController: any = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await usersService(res);
        return res.json(data);
    } catch (error) {
        return next(error);
    }
};

export default usersController;
