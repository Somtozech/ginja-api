import * as utilityService from '../../core/helpers/utilities';
import logger from '../../core/utils/logger';

const PayStack = require('paystack-node');

const APIKEY = process.env.PAYSTACK_API_KEY;
const environment = process.env.NODE_ENV;

const PaystackApi = require('paystack-api')(APIKEY);

export default class Paystack {
    private paystack = new PayStack(APIKEY, environment);

    public resolveAccountNumber = async (params: object): Promise<any> => {
        try {
            const body = await utilityService.validate(params, {
                accountNumber: 'required|string',
                bankCode: 'required|string'
            });
            const response = await this.paystack.resolveAccountNumber({
                account_number: body.accountNumber,
                bank_code: body.bankCode
            });
            logger.info('Response account', response);
            return response;
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public initializeTransaction = async (params: object): Promise<any> => {
        try {
            const body = await utilityService.validate(params, {
                reference: 'required|string',
                amount: 'required|numeric',
                email: 'required|string'
            });
            const response = await this.paystack.initializeTransaction({
                reference: body.reference,
                amount: body.amount,
                email: body.email
            });
            logger.info('Response account', response);
            return response;
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public verifyTransaction = async ({ reference }: any): Promise<any> => {
        console.log(reference);
        const response = await this.paystack.verifyTransaction({
            reference
        });

        return response.body;
    };

    // public verifyTransaction = async (params: object): Promise<any> => {
    //     try {
    //         const body = await utilityService.validate(params, {
    //             reference: 'required|string'
    //         });
    //         const response = await this.paystack.verifyTransaction({
    //             reference: body.reference
    //         });
    //         logger.info('Response account', response);
    //         return response;
    //     } catch (error) {
    //         logger.error('get token', error);
    //         throw error;
    //     }
    // };

    public createTransferRecipient = async (params: any): Promise<any> => {
        // TODO add validation

        const response = await PaystackApi.transfer_recipient.create({
            type: 'nuban',
            name: params.name,
            account_number: params.accountNumber,
            bank_code: params.bankCode,
            currency: 'NGN'
        });

        return response;
    };

    public initializeTransfer = async (params: any): Promise<any> => {
        const response = await PaystackApi.transfer.create({
            source: 'balance',
            amount: params.amount,
            recipient: params.recipientCode
        });

        return response;
    };

    // Paystack Package dosen't support verification of transfer
    public verifyTransfer = async (params: any): Promise<any> => {};
}
