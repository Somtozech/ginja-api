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
    },
    signups: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getSignUps(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    commissionsByDate: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getCommissionsByDate(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    transactionsByDate: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await statisticsService.getTransactionsByDate(res);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default statisticsController;
