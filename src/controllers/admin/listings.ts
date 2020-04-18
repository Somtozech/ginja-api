import { Request, Response, NextFunction } from 'express';
import listingsService from '../../services/admin/listingsService';

const stocksController = {
    allListings: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await listingsService.getListings(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    allRequisitions: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await listingsService.getRequisitions(res);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    updateListing: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await listingsService.updateListing(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    },
    deleteListing: async (req: Request, res: Response, next: NextFunction): Promise<any> => {
        try {
            const data = await listingsService.deleteListing(res, req);
            return data;
        } catch (error) {
            return next(error);
        }
    }
};

export default stocksController;
