/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Payment from '../integrations/Payment';
import { createTransaction } from './transaction';
import { changeStatus, requisitions } from './requisition';
import { createChat } from './chats';

const payment = new Payment();

const createWallet = async (graph: any, params: any) => {
    try {
        const {
            context: { prisma }
        } = graph;

        const { bank, userId } = params;

        const {
            status,
            data: { recipient_code }
        } = await payment.paystack.createTransferRecipient({
            name: bank.accountName,
            bankCode: bank.bankCode,
            accountNumber: bank.accountNumber
        });

        if (status !== true) {
            throw new Error('Creation of Wallet Failed');
        }

        return await prisma.createWallet({
            ledgerBalance: 0,
            availableBalance: 0,
            userId,
            recipientCode: recipient_code,
            owner: {
                connect: {
                    id: userId
                }
            },
            bank: {
                connect: {
                    id: bank.id
                }
            }
        });
    } catch (error) {
        throw error;
    }
};

// Add Money to Wallet
const fundWallet = async (graph: any): Promise<any> => {
    // verify if payment was successful
    const {
        args: {
            reference,
            user: { id: userId }
        },
        context: { prisma }
    } = graph;

    const { data, status } = await payment.paystack.verifyTransaction({
        reference
    });

    const transactionArgs = {
        to: userId,
        user: userId,
        amount: data.amount,
        userId,
        type: 1,
        description: 'Top up',
        status: 2
    };

    if (status !== true) {
        await createTransaction({ args: { ...transactionArgs, status: 1 }, context: graph.context });
        return { success: false };
    }

    const filter = { userId };

    // update user wallet
    const user = await prisma.wallet({ ...filter });
    const updateData = {
        ledgerBalance: user.ledgerBalance + data.amount,
        availableBalance: user.availableBalance + data.amount
    };

    await prisma.updateWallet({ where: { ...filter }, data: { ...updateData } });

    await createTransaction({ args: transactionArgs, context: graph.context });

    return { id: reference, success: true };
};

// withdraw Money from account
const withdrawFromWallet = async (graph: any): Promise<any> => {
    const {
        args: { amount },
        context: {
            prisma,
            user: { id: userId }
        }
    } = graph;

    const wallet = await prisma.wallet({ userId });

    if (!wallet) {
        return { success: false };
    }

    const amountInKobo = amount * 100;

    const transactionArgs = {
        to: userId,
        user: userId,
        amount: amountInKobo,
        userId,
        type: 2,
        description: 'Withdrawal',
        status: 2
    };

    if (wallet.ledgerBalance < amountInKobo) {
        await createTransaction({ args: { ...transactionArgs, status: 1 }, context: graph.context });
        return { success: false };
    }

    // if you are a starter business, it returnss an error that you can't make payment
    const { status, data } = await payment.paystack.initializeTransfer({ recipientCode: wallet.recipientCode, amount: amountInKobo });
    if (status !== true) {
        return { success: false };
    }

    // deduct amount from user account
    await prisma.updateWallet({
        where: { userId },
        data: {
            ledgerBalance: wallet.ledgerBalance - amountInKobo,
            availableBalance: wallet.availableBalance - amountInKobo
        }
    });

    await createTransaction({ args: transactionArgs, context: graph.context });

    return { success: true };
};

// make payment
const makePayment = async (graph: any) => {
    try {
        const {
            args: { requisition },
            context: { prisma }
        } = graph;
        const {
            user,
            listing: { user: warehouser },
            cost: { baseCost, discount, vat },
            space
        } = requisition;

        // calculate total Payable Amount

        const warehouseCost = baseCost * (space ? parseInt(space, 10) : 0);

        const disCountAmount = (discount / 100) * warehouseCost;
        const vatAmount = (vat / 100) * warehouseCost;
        const totalAmount = warehouseCost - disCountAmount + vatAmount;

        //calculate amount payable to warehouser
        const payableAmountInKobo = warehouseCost - disCountAmount;
        // convert totalAmount to Kobo
        const amountInKobo = totalAmount * 100;

        // check balance of merchant that is making payment;
        const merchant = await prisma.wallet({
            userId: user.id
        });

        merchant.ledgerBalance = merchant.ledgerBalance ? merchant.ledgerBalance : 0;

        const transactionArgs = {
            to: warehouser.id,
            user: user.id,
            amount: amountInKobo,
            userId: user.id,
            type: 2,
            description: 'Rent Payment'
        };

        // if amount in wallet less than payable amount
        if (!merchant || merchant.ledgerBalance < amountInKobo) {
            await createTransaction({ args: { ...transactionArgs, status: 1 }, context: graph.context });
            return { success: false };
        }

        // get warehouser payment was made to and reflect payment
        const filter = { userId: warehouser.id };
        const owner = await prisma.wallet({ ...filter });
        owner.availableBalance = owner.availableBalance ? owner.availableBalance : 0;

        const updatedBalance = owner.availableBalance + payableAmountInKobo;

        await prisma.updateWallet({
            where: { ...filter },
            data: { availableBalance: updatedBalance }
        });

        // deduct amount from merchants wallet
        await prisma.updateWallet({
            where: { userId: user.id },
            data: {
                ledgerBalance: merchant.ledgerBalance - amountInKobo,
                availableBalance: merchant.availableBalance - amountInKobo
            }
        });

        // create a new transaction for payment for merchant
        await createTransaction({ args: transactionArgs, context: graph.context });

        // create a new transaction for warehouser
        await createTransaction({
            args: { ...transactionArgs, userId: warehouser.id, type: 1, description: 'New Rent' },
            context: graph.context
        });

        // update Requisition status
        await changeStatus({ args: { status: 5, id: requisition.id }, context: graph.context });

        // create new chat for warehouser and merchant
        await createChat({
            args: { merchantId: user.id, warehouserId: warehouser.id, requisitionId: requisition.id },
            context: graph.context
        });

        return { success: true };
    } catch (error) {
        throw error;
    }
};

const transfer = async (graph: any) => {
    const {
        args: { recipientId, amount },
        context: {
            prisma,
            user: { id: userId }
        }
    } = graph;

    const recipient = await prisma.user({ id: recipientId });
    
    if (!recipient) throw new Error("Transfer Recipient dosen't exist");

    const amountInKobo = amount * 100;

    const transactionArgs = {
        to: recipientId,
        user: userId,
        amount: amountInKobo,
        userId,
        type: 2,
        description: 'Transfer'
    };

    const senderWallet = await prisma.wallet({ userId });

    if (senderWallet.ledgerBalance < amountInKobo) {
        await createTransaction({ args: { ...transactionArgs, status: 1 } });
        return { success: false };
    }
    const recipientWallet = await prisma.wallet({ userId: recipientId });

    // deduct from sender's wallet
    await prisma.updateWallet({
        where: { userId },
        data: {
            ledgerBalance: senderWallet.ledgerBalance - amountInKobo,
            availableBalance: senderWallet.availableBalance - amountInKobo
        }
    });

    // update recipient Wallet
    await prisma.updateWallet({
        where: { userId: recipientId },
        data: {
            ledgerBalance: recipientWallet.ledgerBalance + amountInKobo,
            availableBalance: recipientWallet.availableBalance + amountInKobo
        }
    });

    // create transaction for sender
    await createTransaction({ args: transactionArgs, context: graph.context });

    // create transaction for recipient
    await createTransaction({
        args: { ...transactionArgs, userId: recipientId, type: 2, description: 'Money Received' },
        context: graph.context
    });

    return {
        id: recipientId,
        success: true
    };
};

export { createWallet, makePayment, fundWallet, withdrawFromWallet, transfer };
