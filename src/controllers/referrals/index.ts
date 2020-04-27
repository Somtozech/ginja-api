import * as refferalService from '../../services/referrals';

const setTarget = async (parent: any, args: any, context: any): Promise<any> => {
    try {
        return await refferalService.setTarget({ parent, args, context });
    } catch (error) {
        throw error;
    }
};

const crowns = async (parent: any, args: any, context: any): Promise<any> => {
    try {
        return await refferalService.crowns({ parent, args, context });
    } catch (error) {
        throw error;
    }
};

const referralEarnings = async (parent: any, args: any, context: any): Promise<any> => {
    try {
        return await refferalService.referralEarnings({ parent, args, context });
    } catch (error) {
        throw error;
    }
};

// eslint-disable-next-line import/prefer-default-export
export { setTarget, crowns, referralEarnings };
