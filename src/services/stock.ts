/* eslint-disable @typescript-eslint/explicit-function-return-type */
// Create Stock

const createStock = async (graph: any) => {
    const { context, args } = graph;
    const { prisma } = context;
    const { products, cost = 0, requisition, type } = args;
    try {
        const result = await prisma.createStock({
            products: {
                create: products
            },
            cost,
            requisition: {
                connect: {
                    id: requisition
                }
            },
            type,
            status: 1
        });
        if (result) {
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        throw error;
    }
};

// Create Dispatch
const createDispatch = async (graph: any) => {
    const { context, args } = graph;
    const { prisma } = context;
    const {
        id,
        dispatch: {
            productName,
            productSize,
            quantityPerSize,
            totalQuantity,
            pickupAgentName,
            pickupAgentPhone,
            pickupAgentIdentification,
            pickupAgentIdNumber,
            pickupDateMin,
            pickupDateMax,
            status,
            pickupDate
        }
    } = args;
    try {
        const result = await prisma.updateStock({
            where: { id },
            data: {
                dispatch: {
                    create: {
                        dispatchProduct: {
                            create: {
                                productName,
                                productSize,
                                quantityPerSize,
                                totalQuantity
                            }
                        },
                        pickupAgentName,
                        pickupAgentPhone,
                        pickupAgentIdentification,
                        pickupAgentIdNumber,
                        pickupDateMin,
                        pickupDateMax,
                        pickupDate,
                        status
                    }
                }
            }
        });
        if (result) {
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        throw error;
    }
};

// Update Stock Product
const updateStockProduct = async (graph: any) => {
    const { context, args } = graph;
    const { prisma } = context;
    const { id, products } = args;
    try {
        let type;
        if (products.length > 0) {
            type = 1;
        } else {
            type = 2;
        }
        const result = await prisma.updateStock({
            where: { id },
            data: {
                // products: {
                //     update: products
                // },
                type
            }
        });
        if (result) {
            return { success: true };
        }
        return { success: false };
    } catch (error) {
        throw error;
    }
};

// Get requisition Stocks
const stocks = async (graph: any) => {
    const { args, context } = graph;
    const { prisma } = context;
    const { first, skip, merchant, warehouser, status } = args;

    const filterByMerchant = merchant
        ? {
            requisition: {
                user: {
                    id: merchant
                }
            }
        }
        : {};

    const filterByWarehouser = warehouser
        ? {
            requisition: {
                listing: {
                    user: {
                        id: warehouser
                    }
                }
            }
        }
        : {};

    const filterByStatus = status
        ? {
            status
        }
        : {};

    const where =
        {
            ...filterByMerchant,
            ...filterByWarehouser,
            ...filterByStatus
        } || {};

    const skipQuery = skip ? { skip } : {};
    const firstQuery = first ? { first } : {};
    const QueryParams = {
        ...skipQuery,
        ...firstQuery
    };
    try {
        return await prisma.stocks({
            where,
            ...QueryParams
        });
    } catch (error) {
        throw error;
    }
};

// update stock status
const updateStockStatus = async (graph: any) => {
    const {
        args: { stockId, status },
        context: { prisma }
    } = graph;

    const updatedStock = await prisma.updateStock({ where: { id: stockId }, data: { status } });

    if (updatedStock) {
        return { id: updatedStock.id, success: true, status };
    }

    return { id: stockId, success: false, status };
};

// update stock dispatch status
const updateDispatchStatus = async (graph: any) => {
    const {
        args: { stockId, status },
        context: { prisma }
    } = graph;

    const updatedDispatch = await prisma.updateStock({
        where: { id: stockId },
        data: {
            dispatch: {
                update: {
                    status
                }
            }
        }
    });

    if (updatedDispatch) {
        return { id: updatedDispatch.id, success: true, status };
    }

    return { id: stockId, success: false, status };
};

const retrieveDashboardInfo = async (graph: any) => {
    const {
        args,
        context: { role, user: authUser, prisma }
    }: any = graph;
    const { name } = role;
    const { first, skip, userId: id, range } = args;
    let where;
    let filterbyListing;
    let filterbyRange = {};
    if (range) {
        filterbyRange = {
            AND: [{ createdAt_gte: range.from }, { createdAt_lte: range.to }]
        };
    }
    if (name === 'merchant') {
        filterbyListing = {
            requisition: {
                user: {
                    id: authUser && authUser.id
                },
                listing: {
                    user: {
                        id
                    }
                }
            }
        };
        where =
            {
                ...filterbyListing,
                ...filterbyRange
            } || {};
    }

    if (name === 'warehouser') {
        filterbyListing = {
            requisition: {
                user: {
                    id: authUser && authUser.id
                },
                listing: {
                    user: {
                        id
                    }
                }
            }
        };
        where =
            {
                ...filterbyListing,
                ...filterbyRange
            } || {};
    }

    const skipQuery = skip ? { skip } : {};
    const firstQuery = first ? { first } : {};

    const QueryParams = {
        ...skipQuery,
        ...firstQuery
    };

    try {
        return await prisma.stocks({
            where,
            ...QueryParams
        });
    } catch (error) {
        throw error;
    }
};

export { createStock, createDispatch, updateStockProduct, stocks, updateStockStatus, updateDispatchStatus, retrieveDashboardInfo };
