/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { setTarget, crowns, referralEarnings } from '../../controllers/referrals';

const referralMutations = {
    setTarget: (root: any, args: any, context: any) => setTarget(root, args, context)
};

const referralQueries = {
    crowns: (root: any, args: any, context: any) => crowns(root, args, context),
    referralEarnings: (root: any, args: any, context: any) => referralEarnings(root, args, context)
};

// eslint-disable-next-line import/prefer-default-export
export { referralMutations, referralQueries };
