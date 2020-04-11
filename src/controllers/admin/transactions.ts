import { Request, Response, NextFunction } from 'express';
import transactionsService from '../../services/admin/transactionsService';

const transactionsController: any = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
        const data = await transactionsService.getTransactions(res);
        return data;
    } catch (error) {
        return next(error);
    }
};

export default transactionsController;
