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
    },
    getSignUps: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const users = await prisma.users();

            if (!users) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No Signup yet.',
                    data: 0
                });
            }

            let signupsToday = 0;
            let signupsLast7Days = 0;
            let signupsLast30Days = 0;
            let totalSignups = 0;

            users.forEach((user: any): any => {
                const today = new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
                const last7Days = new Date().getDate() + new Date().getMonth() + new Date().getFullYear() - 7;
                const last30Days = new Date().getDate() + new Date().getMonth() + new Date().getFullYear() - 30;

                const regDay =
                    new Date(user.createdAt).getDate() + new Date(user.createdAt).getMonth() + new Date(user.createdAt).getFullYear();
                if (today === regDay) signupsToday += 1;
                if (regDay >= last7Days) signupsLast7Days += 1;
                if (regDay >= last30Days) signupsLast30Days += 1;
                totalSignups += 1;
            });

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: {
                    today: signupsToday,
                    lastWeek: signupsLast7Days,
                    lastMonth: signupsLast30Days,
                    total: totalSignups
                }
            });
        } catch (err) {
            throw err;
        }
    },
    getCommissionsByDate: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const commissions = await prisma.transactions();

            if (!commissions) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'No commission yet.',
                    data: 0
                });
            }

            let commissionsToday = 0;
            let commissionsLast7Days = 0;
            let commissionsLast30Days = 0;
            let totalCommissions = 0;

            commissions.forEach((commission: any): any => {
                const today = new Date().getDate() + new Date().getMonth() + new Date().getFullYear();
                const last7Days = new Date().getDate() + new Date().getMonth() + new Date().getFullYear() - 7;
                const last30Days = new Date().getDate() + new Date().getMonth() + new Date().getFullYear() - 30;

                const commissionDay =
                    new Date(commission.createdAt).getDate() +
                    new Date(commission.createdAt).getMonth() +
                    new Date(commission.createdAt).getFullYear();
                if (today === commissionDay) commissionsToday += commission.fees;
                if (commissionDay >= last7Days) commissionsLast7Days += commission.fees;
                if (commissionDay >= last30Days) commissionsLast30Days += commission.fees;
                totalCommissions += 1;
            });

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: {
                    today: commissionsToday,
                    lastWeek: commissionsLast7Days,
                    lastMonth: commissionsLast30Days,
                    total: totalCommissions
                }
            });
        } catch (err) {
            throw err;
        }
    }
};
export default statisticsService;
