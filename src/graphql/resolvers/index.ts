import { authTypes, authQueries, authMutations } from './auth';
import { listingTypes, listingQueries, listingMutations } from './listing';
import { roleMutations, roleQueries, roleTypes } from './roles';
import { bankMutations, bankQueries, bankTypes } from './bank';
import { userMutations, userQueries, userTypes, userSubscriptions } from './users';
import { organizationTypes, organizationQueries, organizationMutations } from './organization';
import { stockMutations, stockQueries, stockTypes } from './stock';
import { requisitionTypes, requisitionQueries, requisitionMutations } from './requisition';
import { paymentMutations, paymentQueries, paymentTypes } from './payment';
import { otpTypes, otpMutations } from './otp';
import { miscTypes, miscQueries, miscMutations } from './misc';
import { ratingMutations } from './rating';
import { walletMutations, walletQueries, walletTypes } from './wallet';
import { chatMutations, chatQueries, chatSubscriptions, chatTypes } from './chats';
import { TransactionTypes } from './transaction';
import { uploadMutations } from './upload';

const resolvers = {
    Query: {
        info: () => `This is the API of a Ginjabox`,
        ...authQueries,
        ...listingQueries,
        ...roleQueries,
        ...bankQueries,
        ...organizationQueries,
        ...userQueries,
        ...miscQueries,
        ...requisitionQueries,
        ...stockQueries,
        ...walletQueries,
        ...chatQueries,
        ...paymentQueries
    },
    Mutation: {
        ...authMutations,
        ...roleMutations,
        ...bankMutations,
        ...organizationMutations,
        ...userMutations,
        ...otpMutations,
        ...listingMutations,
        ...ratingMutations,
        ...requisitionMutations,
        ...stockMutations,
        ...walletMutations,
        ...chatMutations,
        ...paymentMutations,
        ...miscMutations,
        ...uploadMutations
    },
    Subscription: {
        ...chatSubscriptions,
        ...userSubscriptions
    },
    ...authTypes,
    ...bankTypes,
    ...organizationTypes,
    ...roleTypes,
    ...userTypes,
    ...otpTypes,
    ...listingTypes,
    ...miscTypes,
    ...requisitionTypes,
    ...stockTypes,
    ...walletTypes,
    ...paymentTypes,
    ...chatTypes,
    ...TransactionTypes
};

export default resolvers;
