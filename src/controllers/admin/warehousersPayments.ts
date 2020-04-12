import { Request, Response, NextFunction } from 'express';
import warehousersPaymentsService from '../../services/admin/warehousersPaymentsService';

const warehousersPaymentsController = {
    allPayments: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await warehousersPaymentsService.getPayments(res);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default warehousersPaymentsController;
