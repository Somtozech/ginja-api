import { makePaymentToWarehouser, fundWallet, transfer } from '../../controllers/wallet';
/* eslint-disable @typescript-eslint/explicit-function-return-type */

const walletQueries = {
    wallet: (parent: any, args: any, context: any) => {
        return context.prisma.wallet({ userId: context.userId });
    }
};

const walletMutations = {
    makePaymentToWarehouser,
    fundWallet,
    transfer
};

const walletTypes = {
    Wallet: {
        id: (parent: any) => parent.id,
        userId: (parent: any) => parent.userId,
        owner: (parent: any, args: any, context: any) => context.prisma.wallet({ id: parent.id }).owner(),
        availableBalance: (parent: any) => parent.availableBalance,
        ledgerBalance: (parent: any) => parent.ledgerBalance,
        transactions: (parent: any, args: any, context: any) => context.prisma.wallet({ id: parent.id }).transactions(),
        bank: (parent: any, args: any, context: any) => context.prisma.wallet({ id: parent.id }).bank()
    }
};

export { walletQueries, walletMutations, walletTypes };
