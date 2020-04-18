const adminRolesService = {
    getRoles: async (res: any): Promise<any> => {
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
    },
    createRole: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const role = await prisma.createAdminRole({
                name: req.body.name
            });

            if (!role) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to create Role',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Role created successfully!',
                data: role
            });
        } catch (err) {
            throw err;
        }
    },
    deleteRole: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const role = await prisma.deleteAdminRole({ id: req.params.id });

            if (!role) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to delete Role!',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Role deleted successfully!',
                data: role
            });
        } catch (err) {
            throw err;
        }
    },
    updateRole: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const role = await prisma.updateAdminRole({
                data: {
                    name: req.body.name
                },
                where: {
                    id: req.body.id
                }
            });

            if (!role) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to update Role!',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Role deleted successfully!',
                data: role
            });
        } catch (err) {
            throw err;
        }
    }
};

export default adminRolesService;
