import { Request, Response, NextFunction } from 'express';
import stocksService from '../../services/admin/stocksService';

const stocksController = {
    dispatchOrders: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await stocksService.getDispatchOrder(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    allStocks: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await stocksService.allStocks(res);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default stocksController;
