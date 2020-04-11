const transactionsService = {
    getTransactions: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const transactions = await prisma.transactions();

            if (!transactions) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no transactions yet.',
                    data: []
                });
            }
            let allTransactions: any[] = transactions.map(
                async (transaction: any): Promise<any> => {
                    const to = await prisma.transaction({ id: transaction.id }).to();
                    const user = await prisma.transaction({ id: transaction.id }).user();
                    return { ...transaction, to, user };
                }
            );

            allTransactions = await Promise.all(allTransactions);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allTransactions
            });
        } catch (err) {
            throw err;
        }
    }
};
export default transactionsService;
