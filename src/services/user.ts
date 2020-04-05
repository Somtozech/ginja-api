/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Create user
const createUser = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const { dob, phoneNumber, email, lastName, firstName, type, bankName, accountName, bankCode, accountNumber } = args;
    try {
        // check if user with args already exists
        const users = await prisma.users({ where: { OR: [{ email }, { phoneNumber }] } });

        if (users.length > 0) {
            throw new Error(`User Already Exists`);
        }
        const user = await prisma.createUser({
            firstName,
            phoneNumber,
            email,
            lastName,
            dob,
            bank: { create: { bankName, accountName, bankCode, accountNumber } },
            type: { connect: { id: type } },
            terms: false
        });
        const bank = await prisma.user({ id: user.id }).bank();
        return { ...user, bank };
    } catch (error) {
        throw error;
    }
};

const acceptTerms = async (graph: any, params: any) => {
    const { context } = graph;
    const { prisma } = context;
    const { id } = params;
    try {
        return await prisma.updateUser({
            data: {
                terms: true
            },
            where: {
                id
            }
        });
    } catch (error) {
        throw error;
    }
};

const checkUser = async (graph: any, params: any) => {
    const {
        context: { prisma }
    } = graph;
    try {
        return await prisma.user(params);
    } catch (error) {
        throw error;
    }
};

export { createUser, checkUser, acceptTerms };
