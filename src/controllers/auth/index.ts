import { UserModel } from '../../interfaces/auth';
import * as authService from '../../services/auth';
import * as organizationService from '../../services/organization';
import { createWallet } from '../../services/wallet';
import * as userService from '../../services/user';
import * as roleService from '../../services/role';
import * as hashUtility from '../../core/utils/bcrypt';
import * as jwtUtility from '../../core/utils/jwt';

const signUp = async (parent: any, args: UserModel, context: any): Promise<any> => {
    try {
        const pin = await hashUtility.hash(args.pin);
        const newArgs = { ...args, pin };

        // Create auth and user
        const user = await authService.createAuth({ parent, args: newArgs, context });

        const {
            id: userId,
            bank: { id: bank }
        } = user;

        const { id: organization } = await organizationService.createOrganization({ parent, args, context }, { bank });

        // Create Wallet for user
        await createWallet({ parent, args, context }, { bank: user.bank, userId });
        // get owner role
        const { id: role } = await roleService.getRoleByParam({ parent, args, context }, { name: 'owner' });

        await organizationService.createUserOrganizationRoles({ parent, args, context }, { role, organization, userId });

        // 3
        const token = jwtUtility.signPayload({ userId });

        // 4
        return {
            token,
            user
        };
    } catch (error) {
        throw error;
        // throw new Error('User with email address and mobile number exits.');
    }
};

const login = async (parent: any, args: UserModel, context: any): Promise<any> => {
    const { phoneNumber } = args;

    const { id, pin, userId } = (await authService.checkAuth({ parent, args, context }, { phoneNumber })) || {};

    console.log('In Auth');
    console.log(id, pin, userId);
    if (!id) {
        throw new Error('Invalid username/password');
    }
    const user = await userService.checkUser({ parent, args, context }, { id: userId });

    if (!user) {
        throw new Error('Invalid username/password');
    }

    // 2
    const valid = await hashUtility.compare(args.pin, pin);

    if (!valid) {
        throw new Error('Invalid username/password');
    }

    const token = jwtUtility.signPayload({ userId: user.id });

    // 3
    return {
        token,
        user
    };
};

const acceptTerms = async (parent: any, args: UserModel, context: any): Promise<any> => {
    const { id: userId } = args;
    const user = await userService.checkUser({ parent, args, context }, { id: userId });
    if (!user) {
        throw new Error('Unable to accept Terms and condition');
    }

    const result = userService.acceptTerms({ parent, args, context }, { id: userId });
    if (!result) {
        throw new Error('Unable to accept Terms and condition');
    }
    // 3
    return {
        success: true
    };
};

export { signUp, login, acceptTerms };
