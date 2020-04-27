import * as WalletService from '../../services/wallet';

interface Result {
    success: boolean;
}

const makePaymentToWarehouser = async (parent: any, args: any, context: any): Promise<Result> => {
    try {
        const { prisma } = context;
        const { requisitionId } = args;

        const filter = { id: requisitionId };

        /* prisma dosen't return the user and listing fields in a normal query. 
        Possibly an issue with prisma. This is the reason for the extra queries for both the user and listing */
        const requisition = await prisma.requisition(filter);
        const listing = await prisma.requisition(filter).listing();

        const warehouser = await prisma.listing({ id: listing.id }).user();
        const user = await prisma.requisition(filter).user();
        const cost = await prisma.requisition(filter).cost();

        requisition.user = user;
        requisition.listing = { user: warehouser };
        requisition.cost = cost;

        if (!requisition) {
            throw new Error("Requisition doesn't Exist");
        }

        return await WalletService.makePayment({
            parent,
            args: { requisition },
            context
        });
    } catch (error) {
        throw error;
    }
};

const fundWallet = async (parent: any, args: any, context: any) => {
    try {
        const response = await WalletService.fundWallet({ parent, args, context });
        return response;
    } catch (error) {
        throw error;
    }
};

const transfer = async (parent: any, args: any, context: any) => {
    try {
        const response = await WalletService.transfer({ parent, args, context });
        return response;
    } catch (error) {
        throw error;
    }
};

const withdraw = async (parent: any, args: any, context: any) => {
    try {
        const response = await WalletService.withdrawFromWallet({ parent, args, context });
        return response;
    } catch (error) {
        throw error;
    }
};

export { makePaymentToWarehouser, fundWallet, transfer, withdraw };
