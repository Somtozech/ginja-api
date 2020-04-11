import { prisma } from '../prisma/generated';
import pubsub from '../prisma/pubsub';

const setUserStatus = async (user: any, active: any): void => {
    const data = {
        status: active ? 'online' : 'offline'
    };

    const userStatus = await prisma.updateUserStatus({ where: { userId: user.id }, data });
    pubsub.publish('USER_STATUS', { userStatus });
};

export default setUserStatus;
