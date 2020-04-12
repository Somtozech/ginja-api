const warehousersPaymentsService = {
    getPayments: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const payments = await prisma.payments();

            if (!payments) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no payments made yet.',
                    data: []
                });
            }

            let allPayments: any[] = payments.map(
                async (payment: any): Promise<any> => {
                    const customer = await prisma.payment({ id: payment.id }).customer();
                    const requisition = await prisma.payment({ id: payment.id }).requisition();
                    return { ...payment, customer, requisition };
                }
            );

            allPayments = await Promise.all(allPayments);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allPayments
            });
        } catch (err) {
            throw err;
        }
    }
};
export default warehousersPaymentsService;
