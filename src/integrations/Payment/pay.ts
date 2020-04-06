import HttpClient from '../../core/utils/client';
import * as utilityService from '../../core/helpers/utilities';
import logger from '../../core/utils/logger';

const paystackBaseUrl = process.env.PAYSTACK_BASE_URL;
const paystackApiKey = process.env.PAYSTACK_API_KEY;

export default class Auth {
    private client = new HttpClient({
        baseUrl: `${paystackBaseUrl}/`
    });

    public initializeTransaction = async (params: object): Promise<any> => {
        try {
            const body = await utilityService.validate(params, {
                reference: 'required|string',
                amount: 'required|numeric',
                email: 'required|string'
            });
            const response = await this.client.post('transaction/initialize', body, {
                headers: {
                    Authorization: `Bearer ${paystackApiKey}`
                }
            });
            logger.info('Response account', response);
            return response ? response.data : {};
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public verifyTransaction = async (reference: any): Promise<any> => {
        try {
            const body = await utilityService.validate(reference, {
                reference: 'required|string'
            });

            const response = await this.client.get(`transaction/verify/${body.reference}`, {
                headers: {
                    Authorization: `Bearer ${paystackApiKey}`
                }
            });
            logger.info('Response account', response);
            return response ? response.data : {};
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public createTransferRecipient = async (params: any): Promise<any> => {
        // TODO add validation
        console.log(params);
        const body = await utilityService.validate(params, {
            account_number: 'required|string',
            bank_code: 'required|string',
            name: 'required|string'
        });

        try {
            const response = await this.client.post(
                'transferrecipient',
                { ...body, type: 'nuban', currency: 'NGN' },
                {
                    headers: {
                        Authorization: `Bearer ${paystackApiKey}`
                    }
                }
            );

            return response ? response.data : {};
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public initializeTransfer = async (params: any): Promise<any> => {
        try {
            const body = await utilityService.validate(params, {
                source: 'required|string',
                amount: 'required|string',
                recipient: 'required|string'
            });
            const response = await this.client.post('transaction/initialize', body, {
                headers: {
                    Authorization: `Bearer ${paystackApiKey}`
                }
            });

            return response ? response.data : {};
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public resolveAccountNumber = async (params: object): Promise<any> => {
        try {
            const body = await utilityService.validate(params, {
                accountNumber: 'required|string',
                bankCode: 'required|string'
            });
            const response = await this.client.get(`bank/resolve?account_number=${body.accountNumber}&bank_code=${body.bankCode}`, {
                headers: {
                    Authorization: `Bearer ${paystackApiKey}`
                }
            });
            logger.info('Response account', response);
            return response ? response.data : {};
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };

    public getBanks = async (): Promise<any> => {
        try {
            const response = await this.client.get('bank', {
                headers: {
                    Authorization: `Bearer ${paystackApiKey}`
                }
            });
            logger.info('Response account', response);
            return response ? response.data : {};
        } catch (error) {
            logger.error('get token', error);
            throw error;
        }
    };
}
