const TransactionTypes = {
    Transaction: {
        id: (parent: any) => parent.id,
        userId: (parent: any) => parent.userId,
        type: (parent: any) => parent.type,
        description: (parent: any) => parent.description,
        fees: (parent: any) => parent.fees,
        status: (parent: any) => parent.status,
        amount: (parent: any) => parent.amount,
        user: (parent: any, args: any, context: any) => context.prisma.transaction({ id: parent.id }).user(),
        to: (parent: any, args: any, context: any) => context.prisma.transaction({ id: parent.id }).to()
    }
};

export { TransactionTypes };
