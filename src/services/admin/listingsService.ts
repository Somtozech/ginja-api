const listingsService = {
    getListings: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const listings = await prisma.listings();

            if (!listings) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no Stock Dispatch yet.',
                    data: []
                });
            }

            let allLisitings: any[] = listings.map(
                async (listing: any): Promise<any> => {
                    const availability = await prisma.listing({ id: listing.id }).availability();
                    const user = await prisma.listing({ id: listing.id }).user();
                    return { ...listing, availability, user };
                }
            );

            allLisitings = await Promise.all(allLisitings);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allLisitings
            });
        } catch (err) {
            throw err;
        }
    },
    getRequisitions: async (res: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const requisitions = await prisma.stocks();

            if (!requisitions) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no Stocks yet.',
                    data: []
                });
            }

            let allRequisitions: any[] = requisitions.map(
                async (requisition: any): Promise<any> => {
                    const products = await prisma.stock({ id: requisition.id }).products();
                    const stockDispatch = await prisma.stock({ id: requisition.id }).stockDispatch();
                    return { ...requisition, products, requisition, stockDispatch };
                }
            );

            allRequisitions = await Promise.all(allRequisitions);

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: allRequisitions
            });
        } catch (err) {
            throw err;
        }
    }
};
export default listingsService;
