import { Request, Response, NextFunction } from 'express';
import usersService from '../../services/admin/usersService';

const usersController = {
    allUsers: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await usersService.getUsers(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    singleUser: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await usersService.getUser(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default usersController;
