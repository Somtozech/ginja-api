/* eslint-disable import/prefer-default-export */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import moment from 'moment';

/**
 * type {
 *   1 - INCOMING TRANSACTIONS - topup , money received from transfer
 *   2 - OUTGOING TRANSACTIONS - withdrawal, transfer, payment for rent
 * }
 */
const createTransaction = async (graph: any) => {
    try {
        const {
            args: { description = '', type = 1, user, userId, amount, to, status = 2, fees = 0 },
            context: { prisma, user: userObj }
        } = graph;

        if (userObj.refCode && userId === user) {
            const referral = await prisma.referral({ refCode: userObj.refCode });
            const transactionsExist = await prisma.$exists.transaction({
                AND: [{ userId: userObj.id }, { OR: [{ description: 'Rent Payment' }, { description: 'Transfer' }] }]
            });

            if (!transactionsExist && moment(referral.endDate).unix() * 1000 >= moment().unix() * 1000) {
                await prisma.createGame({ userId, referralId: referral.id });
            }
        }

        const result = await prisma.createTransaction({
            type,
            description,
            amount,
            userId,
            status,
            fees,
            to: {
                connect: {
                    id: to
                }
            },
            user: {
                connect: {
                    id: user
                }
            }
        });

        return result;
    } catch (error) {
        throw error;
    }
};

export { createTransaction };
