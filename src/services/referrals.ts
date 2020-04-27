/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Create user
import moment from 'moment';
import MailTransport from '../core/utils/email';
import { createTransaction } from './transaction';
import { formatLocalizedMoney } from '../core/helpers/utilities';

const mail = new MailTransport();

interface ReferralPayload {
    status: boolean;
    crown: any;
    startDate: Date;
    endDate: Date;
    boost: number;
    rollover: number;
}

interface Crown {
    id?: string;
    requiredReferrals: number;
    noOfDays: number;
    bonus: number;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    compensationCount: number;
    compensationBonus: number;
}

interface Referral {
    id: string;
    status: boolean;
    refCode: string;
    userId: string;
    crown: Crown;
    createdAt: Date;
    updatedAt: Date;
    startDate: Date;
    endDate: Date;
    boost: number;
    rollover: number;
}

interface ReferralHistory {
    id: string;
    userId: string;
    bonus: number;
    totalReferrals: number;
    endDate: Date;
    crown: Crown;
}

const setTarget = async (graph: any) => {
    const { context, args } = graph;
    const { prisma } = context;
    const { user } = context;
    const { crownId, boost } = args;
    try {
        const referral: Referral = await prisma.referral({ userId: user.id });
        const currentReferralExpired = referral.endDate < moment().toDate();
        if (!referral.status && currentReferralExpired) {
            const crown = await prisma.crown({ id: crownId });

            const payload: ReferralPayload = {
                status: true,
                crown: { connect: { id: crownId } },
                startDate: moment().toDate(),
                endDate: moment()
                    .add(30, 'days')
                    .toDate(),
                boost: 0,
                rollover: 0
            };
            if (boost) {
                if (crown.compensationCount) {
                    const wallet: any = await prisma.wallet({ userId: user.id });
                    payload.boost = Math.ceil((boost * ((crown && crown.requiredReferrals) || 0)) / 100);
                    const transactionArgs = {
                        to: user.id,
                        user: user.id,
                        amount: payload.boost * 50 * 100,
                        userId: user.id,
                        type: 2,
                        description: 'Referral Boost',
                        status: 2
                    };

                    if (wallet.ledgerBalance > transactionArgs.amount) {
                        await createTransaction({ args: transactionArgs, context });
                        await prisma.updateWallet({
                            where: { userId: user.id },
                            data: {
                                ledgerBalance: wallet.ledgerBalance - transactionArgs.amount,
                                availableBalance: wallet.availableBalance - transactionArgs.amount
                            }
                        });
                    }
                } else {
                    throw new Error('Boost cannot be applied to this crown');
                }
            }

            await prisma.updateReferral({
                data: payload,
                where: { userId: user.id }
            });

            const emailData: any = {
                to: user.email,
                from: 'support@gingabox.com',
                templateId: boost ? 'd-f13e0545ee254e3e969a9a64d6447202' : 'd-c1071aea4c0541919c55df62826f5a4a',
                dynamic_template_data: {
                    amount: formatLocalizedMoney(+crown.bonus * 100, 'NGN'),
                    first_name: user.firstName,
                    gold_name: crown.name,
                    days: crown.noOfDays
                }
            };
            mail.sendMail(emailData);
            return { success: true };
        }
        throw new Error('You have an active referral.');
    } catch (error) {
        throw error;
    }
};

const crowns = async (graph: any) => {
    const { context } = graph;
    const { prisma } = context;
    const { user } = context;
    try {
        const referral: Referral = await prisma.referral({ userId: user.id });
        let totalReferrals: [any];
        let userCrown: Crown;
        if (referral.status) {
            userCrown = await prisma.referral({ userId: user.id }).crown();
            totalReferrals = await prisma.games({
                where: {
                    AND: [{ createdAt_lte: referral.endDate }, { createdAt_gte: referral.startDate }, { referralId: referral.id }]
                }
            });
        }

        const allCrowns: [Crown] = await prisma.crowns();
        return allCrowns.map((each: Crown) => {
            if (userCrown && userCrown.id === each.id) {
                return { ...userCrown, status: true, totalReferrals: totalReferrals.length + referral.boost, date: referral.startDate };
            }
            return { ...each, status: false, totalReferrals: 0 };
        });
    } catch (error) {
        throw error;
    }
};

const referralEarnings = async (graph: any) => {
    const { context } = graph;
    const { prisma } = context;
    const { user } = context;
    try {
        return await prisma.referralHistories({ where: { userId: user.id } });
    } catch (error) {
        throw error;
    }
};

// eslint-disable-next-line import/prefer-default-export
export { setTarget, crowns, referralEarnings };
