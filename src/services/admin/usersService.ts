const usersService = async (res: any): Promise<any> => {
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
};

export default usersService;
