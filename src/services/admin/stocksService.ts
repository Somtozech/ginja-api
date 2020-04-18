const stocksService = {
    getDispatchOrder: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const dispatches = await prisma.stockDispatches();

            if (!dispatches) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no Stock Dispatch yet.',
                    data: []
                });
            }

            let allDispatch: any[] = dispatches.map(
                async (disp: any): Promise<any> => {
                    const pickupDate = await prisma.stockDispatch({ id: disp.id }).pickupDate();
                    return { ...disp, pickupDate };
                }
            );

            allDispatch = await Promise.all(allDispatch);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allDispatch
            });
        } catch (err) {
            throw err;
        }
    },
    allStocks: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const stocks = await prisma.stocks();

            if (!stocks) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no Stocks yet.',
                    data: []
                });
            }

            let allStocks: any[] = stocks.map(
                async (stock: any): Promise<any> => {
                    const products = await prisma.stock({ id: stock.id }).products();
                    const requisition = await prisma.stock({ id: stock.id }).requisition();
                    const dispatch = await prisma.stock({ id: stock.id }).dispatch();
                    return { ...stock, products, requisition, dispatch };
                }
            );

            allStocks = await Promise.all(allStocks);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allStocks
            });
        } catch (err) {
            throw err;
        }
    }
};
export default stocksService;
