import { Request, Response, NextFunction } from 'express';
import referralsService from '../../services/admin/referralsService';

const referralsController = {
    allReferrals: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await referralsService.getReferrals(res);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default referralsController;
