import shortid from 'shortid';
import MailTransport from '../core/utils/email';

/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Create auth


const mail = new MailTransport();

const createAuth = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const {
        dob,
        phoneNumber,
        email,
        device = 1,
        refCode,
        lastName,
        firstName,
        type,
        bankName,
        accountName,
        bankCode,
        accountNumber,
        pin
    } = args;
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
                    refCode,
                    bank: { create: { bankName, accountName, bankCode, accountNumber } },
                    type: { connect: { id: type } },
                    terms: false,
                    referral: {
                        create: {
                            status: false,
                            refCode: shortid.generate(),
                            boost: 0,
                            rollover: 0
                        }
                    }
                }
            }
        });
        const user = await prisma.auth({ id: auth.id }).user();
        await prisma.createUserStatus({ userId: user.id });
        await prisma.updateAuth({ data: { userId: user.id }, where: { id: auth.id } });
        const referral = await prisma.user({ id: user.id }).referral();
        await prisma.updateReferral({ data: { userId: user.id }, where: { id: referral.id } });
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
