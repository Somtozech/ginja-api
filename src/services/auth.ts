/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Create auth

import MailTransport from '../core/utils/email';

const mail = new MailTransport();

const createAuth = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const { dob, phoneNumber, email, device = 1, lastName, firstName, type, bankName, accountName, bankCode, accountNumber, pin } = args;
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
                    device,
                    lastName,
                    dob,
                    status: 1,
                    bank: { create: { bankName, accountName, bankCode, accountNumber } },
                    type: { connect: { id: type } },
                    terms: false
                }
            }
        });
        const user = await prisma.auth({ id: auth.id }).user();
        await prisma.updateAuth({ data: { userId: user.id }, where: { id: auth.id } });
        const bank = await prisma.user({ id: user.id }).bank();
        const emailData: any = {
            to: email,
            from: 'support@gingabox.com',
            subject: 'Welcome to Ginjabox',
            templateId: 'd-c0fbd426b01744e4861a30179cf0e3ee',
            dynamic_template_data: {
                full_name: `${firstName} ${lastName}`
            }
        };
        if (bank) {
            mail.sendMail(emailData);
        }
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
