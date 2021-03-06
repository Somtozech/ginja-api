import {
    createStock,
    updateDispatchStatus,
    createDispatch,
    stocks,
    updateStockStatus,
    retrieveDashboardInfo
} from '../../controllers/stock';

const stockQueries = {
    stocks: (root: any, args: any, context: any, info: any) => stocks(root, args, context),
    retrieveDashboardInfo: (root: any, args: any, context: any) => retrieveDashboardInfo(root, args, context)
};

const stockMutations = {
    createStock: (root: any, args: any, context: any) => createStock(root, args, context),
    createDispatch: (root: any, args: any, context: any) => createDispatch(root, args, context),
    updateStockStatus,
    updateDispatchStatus
};

const stockTypes = {
    Stock: {
        id: (parent: any) => parent.id,
        type: (parent: any) => parent.type,
        products: (parent: any, args: any, context: any) => context.prisma.stock({ id: parent.id }).products(),
        status: (parent: any) => parent.status,
        dispatch: (parent: any, args: any, context: any) => context.prisma.stock({ id: parent.id }).dispatch(),
        requisition: (parent: any, args: any, context: any) => context.prisma.stock({ id: parent.id }).requisition()
    }
};

export { stockQueries, stockMutations, stockTypes };
