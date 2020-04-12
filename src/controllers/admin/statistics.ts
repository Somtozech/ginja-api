import { Request, Response, NextFunction } from 'express';
import statisticsService from '../../services/admin/statisticsService';

const statisticsController = {
    totalUsers: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getTotalUsers(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    usersByOs: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getUsersByOs(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    totalCommissions: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getCommissions(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    totalTransactions: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getTotalTransactions(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    totalAvailableWarehouses: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getAvailableWarehouses(res);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default statisticsController;
