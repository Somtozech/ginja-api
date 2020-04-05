import authMiddleware from '../../core/middlewares/validateToken';

const permissions = {
    Query: {
        banks: authMiddleware,
        users: authMiddleware,
        auths: authMiddleware,
        roles: authMiddleware,
        role: authMiddleware,
        organizations: authMiddleware,
        chats: authMiddleware,
        chatMessages: authMiddleware,
        listings: authMiddleware,
        payments: authMiddleware,
        stocks: authMiddleware,
        userOrganizationRoles: authMiddleware,
        requisitions: authMiddleware,
        getUser: authMiddleware,
        wallet: authMiddleware
    },
    Mutation: {
        acceptTerms: authMiddleware,
        createRole: authMiddleware,
        createOrganizationType: authMiddleware,
        changeRequisitionStatus: authMiddleware,
        submitRating: authMiddleware,
        addListing: authMiddleware,
        createRequisition: authMiddleware,
        createStock: authMiddleware,
        createDispatch: authMiddleware,
        makePaymentToWarehouser: authMiddleware,
        addMessage: authMiddleware,
        fundWallet: authMiddleware,
        changeRequisitionStatus: authMiddleware,
        submitRating: authMiddleware,
        addListing: authMiddleware,
        createRequisition: authMiddleware,
        createStock: authMiddleware,
        createDispatch: authMiddleware,
        initializePayment: authMiddleware,
        verifyPayment: authMiddleware,
        transfer: authMiddleware
    }
};

export default permissions;
