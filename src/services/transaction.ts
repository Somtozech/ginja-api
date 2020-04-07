/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * type {
 *   1 - INCOMING TRANSACTIONS - topup , money received from transfer
 *   2 - OUTGOING TRANSACTIONS - withdrawal, transfer, payment for rent
 * }
 */
const createTransaction = async (graph: any) => {
    try {
        const {
            args: { description = '', user, type = 1, userId, amount, to, status = 2, fees = 0 },
            context: { prisma }
        } = graph;

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

const updateTransaction = (graph: any, params: any) => {};

export { createTransaction, updateTransaction };
