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
            const requisitions = await prisma.requisitions();

            if (!requisitions) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'There are no Requisitions yet.',
                    data: []
                });
            }

            let allRequisitions: any[] = requisitions.map(
                async (requisition: any): Promise<any> => {
                    const products = await prisma.requisition({ id: requisition.id }).products();
                    const duration = await prisma.requisition({ id: requisition.id }).duration();
                    const cost = await prisma.requisition({ id: requisition.id }).cost();
                    const listing = await prisma.requisition({ id: requisition.id }).listing();
                    return { ...requisition, products, duration, cost, listing };
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
    },
    updateListing: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const data = req.body;
            const listing = await prisma.updateListing({
                data,
                where: {
                    id: req.params.id
                }
            });

            if (!listing) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to update Listing.',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: listing
            });
        } catch (err) {
            throw err;
        }
    },
    deleteListing: async (res: any, req: any): Promise<any> => {
        const { locals } = res;
        const { prisma } = locals;

        try {
            const listing = await prisma.deleteListing({ id: req.params.id });

            if (!listing) {
                return res.json({
                    success: true,
                    error: false,
                    message: 'Unable to delete Listing.',
                    data: []
                });
            }

            return res.json({
                success: true,
                error: false,
                message: 'Success',
                data: listing
            });
        } catch (err) {
            throw err;
        }
    }
};
export default listingsService;
