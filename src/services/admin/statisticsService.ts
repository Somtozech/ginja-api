const statisticsService = {
    getTotalUsers: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const users = await prisma.users();

            if (!users) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No Users yet.',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: users.length
            });
        } catch (err) {
            throw err;
        }
    },
    getTotalTransactions: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const transactions = await prisma.transactions();

            if (!transactions) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No transactions yet.',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: transactions.length
            });
        } catch (err) {
            throw err;
        }
    },
    getCommissions: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const commissions = await prisma.transactions();

            if (!commissions) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No Commisions yet.',
                    data: 0
                });
            }
            let total = 0;

            commissions.forEach((commission: any): any => {
                total += commission.fees;
            });

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: total
            });
        } catch (err) {
            throw err;
        }
    },
    getUsersByOs: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const users = await prisma.users();

            if (!users) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No Users yet.',
                    data: 0
                });
            }

            let android = 0;
            let ios = 0;

            users.forEach((user: any): any => {
                if (user.device === 1) android += 1;
                if (user.device === 2) ios += 1;
            });

            const total = android + ios;

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: { android, ios, total }
            });
        } catch (err) {
            throw err;
        }
    },
    getAvailableWarehouses: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const listings = await prisma.listings();

            if (!listings) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No Users yet.',
                    data: 0
                });
            }

            let allListings: any[] = listings.map(
                async (listing: any): Promise<any> => {
                    const availability = await prisma.listing({ id: listing.id }).availability();
                    return { ...listing, availability };
                }
            );

            allListings = await Promise.all(allListings);

            let available = 0;

            allListings.forEach((listing: any): any => {
                if (listing.availability.to > Date.now()) available += 1;
            });

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: available
            });
        } catch (err) {
            throw err;
        }
    }
};
export default statisticsService;
