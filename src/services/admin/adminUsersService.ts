import bcrypt from 'bcrypt';

const adminUsersService = {
    getAdmins: async (res: any): Promise<any> => {
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
    },
    createAdmin: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;
        const salt = await bcrypt.genSalt(10);

        try {
            const staff = await prisma.createAdminUser({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                phoneNumber: req.body.phoneNumber,
                roleId: parseInt(req.body.roleId, 10),
                role: {
                    connect: { id: req.body.role }
                },
                password: await bcrypt.hash(req.body.password.toString(), salt)
            });

            if (!staff) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to crerate AdminUser!',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'AdminUser created successfully!',
                data: staff
            });
        } catch (err) {
            throw err;
        }
    },
    deleteAdmin: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const staff = await prisma.deleteAdminUser({ id: req.params.id });

            if (!staff) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to Delete AdminUser!',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'AdminUser deleted successfully!',
                data: staff
            });
        } catch (err) {
            throw err;
        }
    },
    updatePassword: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const staff = await prisma.adminUser({ email: req.body.email });

            if (!staff) {
                return res.json({
                    success: false,
                    error: true,
                    message: 'Unable to update password!',
                    data: []
                });
            }
            const match = await bcrypt.compare(req.body.oldPassword, staff.password);
            if (!match) {
                return res.json({
                    success: false,
                    error: true,
                    message: 'Old password is not correct!',
                    data: []
                });
            }

            const salt = await bcrypt.genSalt(10);
            const update = await prisma.updateAdminUser({
                data: {
                    password: await bcrypt.hash(req.body.newPassword.toString(), salt)
                },
                where: {
                    email: req.body.email
                }
            });

            if (!update) {
                return res.json({
                    success: false,
                    error: true,
                    message: 'Unable to update password!',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Password Updated Successfully!',
                data: staff
            });
        } catch (err) {
            throw err;
        }
    }
};

export default adminUsersService;
