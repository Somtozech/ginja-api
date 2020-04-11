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

            // const role = await prisma.createUser({
            //     firstName: 'John',
            //     lastName: 'Kester',
            //     bankName: 'UBA',
            //     bankCode: '078',
            //     dob: '2000/09/11',
            //     type: 'ck5lippgi00140a31lloh8pef',
            //     email: 'kester@email.com',
            //     pin: '123456',
            //     phoneNumber: '08066787665',
            //     accountName: 'Nnamani Kester',
            //     accountNumber: '2098765432'
            // });

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
            const role = await prisma.deleteAdminRole({ id: req.body.id });

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
    }
};

export default adminRolesService;
