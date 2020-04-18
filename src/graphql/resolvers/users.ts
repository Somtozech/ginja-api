import { withFilter } from 'graphql-yoga';

const userQueries = {
    users: (root: any, args: any, context: any, info: any) => {
        return context.prisma.users();
    },
    getUser: (root: any, args: any, context: any, info: any) => {
        return context.prisma.user({ ...args });
    }
};

const userMutations = {};

const userTypes = {
    User: {
        id: (parent: any) => parent.id,
        firstName: (parent: any) => parent.firstName,
        lastName: (parent: any) => parent.lastName,
        email: (parent: any) => parent.email,
        phoneNumber: (parent: any) => parent.phoneNumber,
        dob: (parent: any) => parent.dob,
        terms: (parent: any) => parent.terms,
        type: (parent: any, args: any, context: any) => context.prisma.user({ id: parent.id }).type(),
        bank: (parent: any, args: any, context: any) => context.prisma.user({ id: parent.id }).bank(),
        status: (parent: any, args: any, context: any) => context.prisma.userStatus({ userId: parent.id })
    }
};

const userSubscriptions = {
    userStatus: {
        subscribe: withFilter(
            (parent: any, args: any, context: any, info: any) => {
                const { pubsub } = context;
                console.log('User Status Called');
                return pubsub.asyncIterator(['USER_STATUS']);
            },
            (payload: any, variables: any, context: any) => {
                const { user } = context;
                return payload.userStatus.userId !== user.id;
            }
        )
    }
};

export { userTypes, userMutations, userQueries, userSubscriptions };
