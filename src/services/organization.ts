/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Create Bank
const createOrganization = async (graph: any, params: any) => {
    const { parent, args, context } = graph;
    const { prisma } = context;
    const { firstName, lastName, email, phoneNumber, type } = args;

    const { bankId } = params;

    try {
        return await prisma.createOrganization({
            name: `${firstName} ${lastName}`,
            email,
            phoneNumber,
            bank: {
                connect: {
                    id: bankId
                }
            },
            type: {
                connect: {
                    id: type
                }
            }
        });
    } catch (error) {
        throw error;
    }
};

// Create User Organization Roles
const createUserOrganizationRoles = async (graph: any, params: any) => {
    const { parent, args, context } = graph;
    const { prisma } = context;
    const { userId, roleId, organizationId } = params;
    try {
        return await prisma.createUserOrganizationRole({
            user: {
                connect: {
                    id: userId
                }
            },
            role: {
                connect: {
                    id: roleId
                }
            },
            organization: {
                connect: {
                    id: organizationId
                }
            }
        });
    } catch (error) {
        throw error;
    }
};

// Create Organization Type
const createOrganizationType = async (graph: any) => {
    const { parent, args, context } = graph;
    const { prisma } = context;
    const { name } = args;
    try {
        return await prisma.createOrganizationType({
            name
        });
    } catch (error) {
        throw error;
    }
};

export { createOrganization, createUserOrganizationRoles, createOrganizationType };
