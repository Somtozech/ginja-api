const adminRolesService = async (res: any): Promise<any> => {
    const { locals } = res;
    const { prisma } = locals;

    try {
        const roles = await prisma.adminRoles();

        if (!roles) {
            return res.json({
                success: true,
                error: false,
                message: 'There are no Roles created yet.',
                data: []
            });
        }

        return res.json({
            success: true,
            error: false,
            message: 'Success',
            data: roles
        });
    } catch (err) {
        throw err;
    }
};

export default adminRolesService;
