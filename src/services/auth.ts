/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Create auth
const createAuth = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const { dob, phoneNumber, email, lastName, firstName, type, bankName, accountName, bankCode, accountNumber, pin } = args;
    try {
        // check if user with args already exists
        const users = await prisma.users({ where: { OR: [{ email }, { phoneNumber }] } });

        if (users.length > 0) {
            throw new Error(`User Already Exists`);
        }
        const auth = await prisma.createAuth({
            pin,
            phoneNumber,
            email,
            user: {
                create: {
                    firstName,
                    phoneNumber,
                    email,
                    lastName,
                    dob,
                    bank: { create: { bankName, accountName, bankCode, accountNumber } },
                    type: { connect: { id: type } },
                    terms: false
                }
            }
        });

        const user = await prisma.auth({ id: auth.id }).user();
        await prisma.createUserStatus({ userId: user.id });
        await prisma.updateAuth({ data: { userId: user.id }, where: { id: auth.id } });
        const bank = await prisma.user({ id: user.id }).bank();

        return { ...user, bank };
    } catch (error) {
        throw error;
    }
};

const checkAuth = async (graph: any, params: any) => {
    const {
        context: { prisma }
    } = graph;

    try {
        return await prisma.auth(params);
    } catch (error) {
        throw error;
    }
};

export { createAuth, checkAuth };
