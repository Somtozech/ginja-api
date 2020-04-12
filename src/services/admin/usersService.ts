const usersService = {
    getUsers: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const users = await prisma.users();

            if (!users) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no registered user yet.',
                    data: []
                });
            }
            let allUsers: any[] = users.map(
                async (user: any): Promise<any> => {
                    const bank = await prisma.user({ id: user.id }).bank();
                    const type = await prisma.user({ id: user.id }).type();
                    return { ...user, bank, type };
                }
            );

            allUsers = await Promise.all(allUsers);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allUsers
            });
        } catch (err) {
            throw err;
        }
    },
    getUser: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const user = await prisma.user({ id: req.params.id });
            const bank = await prisma.user({ id: user.id }).bank();
            const type = await prisma.user({ id: user.id }).type();
            const ratings = await prisma.ratings({ where: { userId: req.params.id } });
            const transactions = await prisma.transactions({ where: { user: { id: req.params.id } } });
            const listings = await prisma.listings({ where: { user: { id: req.params.id } } });
            const wallet = await prisma.wallet({ userId: req.params.id });

            if (!user) {
                return res.json({
                    success: true,
                    error: false,
                    message: "User Doesn't Exist",
                    data: []
                });
            }
            const singleUser = { ...user, bank, type, ratings, transactions, listings, wallet };

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: singleUser
            });
        } catch (err) {
            throw err;
        }
    }
};
export default usersService;
