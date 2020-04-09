const adminUsersService = async (res: any): Promise<any> => {
    const { locals } = res;
    const { prisma } = locals;

    try {
        const staff = await prisma.adminUsers();

        if (!staff) {
            return res.json({
                success: true,
                error: false,
                message: 'There are no registered user yet.',
                data: []
            });
        }
        let allStaff: any[] = staff.map(
            async (user: any): Promise<any> => {
                const role = await prisma.adminUser({ id: user.id }).role();
                return { ...user, role };
            }
        );

        allStaff = await Promise.all(allStaff);

        return res.json({
            success: true,
            error: false,
            message: 'Success',
            data: allStaff
        });
    } catch (err) {
        throw err;
    }
};

export default adminUsersService;
