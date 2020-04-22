/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Create Requisition

const createRequisition = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const { duration, cost, user, listing, expires, products, space } = args;
    try {
        const result = await prisma.createRequisition({
            duration: {
                connect: duration
            },
            cost: {
                create: cost
            },
            user: {
                connect: { id: user }
            },
            listing: {
                connect: { id: listing }
            },
            expires,
            products: {
                connect: products
            },
            space,
            status: 1
        });
        if (result) return { success: true };
        return { success: false };
    } catch (error) {
        throw error;
    }
};

const requisitions = async (graph: any) => {
    const {
        args,
        context: { role, user: authUser, prisma }
    } = graph;
    const { name } = role;

    const { first, skip, user, limit, nextToken, listing, status } = args;
    let filterbyUser = user ? { user: { id: user } } : {};
    let filterbyListing = listing ? { listing: { id: listing } } : {};
    let statusQuery = {};

    if (name === 'warehouser') {
        filterbyUser = {};
        filterbyListing = {
            listing: {
                ...(filterbyListing.listing && filterbyListing.listing),
                user: { id: authUser.id }
            }
        };
    }
    if (status !== 4) {
        statusQuery = { status };
    }

    const where =
        {
            ...filterbyUser,
            ...filterbyListing,
            ...statusQuery
        } || {};
    const skipQuery = skip ? { skip } : {};
    const firstQuery = first ? { first } : {};
    const QueryParams = {
        ...skipQuery,
        ...firstQuery
    };

    try {
        return await prisma.requisitions({
            where,
            ...QueryParams
        });
    } catch (error) {
        throw error;
    }
};

const changeStatus = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const { id, status } = args;
    const { name: role } = context.role;
    if (role === 'warehouser' && (status === 2 || status === 3)) {
        const result = await prisma.updateRequisition({
            where: { id },
            data: {
                status
            }
        });
        if (result) return { success: true };
    }
    if (role === 'merchant' && status === 5) {
        const result = await prisma.updateRequisition({
            where: { id },
            data: {
                status
            }
        });
        if (result) return { success: true };
    }

    return { success: false };
};

export { createRequisition, requisitions, changeStatus };
