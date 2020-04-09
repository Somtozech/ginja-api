/* eslint-disable no-param-reassign */
import fs from 'fs';
import path from 'path';
import jwt, { NotBeforeError, TokenExpiredError } from 'jsonwebtoken';
import { NotAuthenticatedError, BadRequestError } from '../errors';
import { prisma } from '../prisma/generated';

const verifyToken = async (token: any): Promise<any> => {
    const verifyOptions = {
        issuer: process.env.JWT_TOKEN_ISSUER,
        subject: process.env.JWT_TOKEN_SUBJECT,
        audience: process.env.JWT_TOKEN_AUDIENCE,
        expiresIn: process.env.JWT_TOKEN_TTL,
        algorithm: [process.env.JWT_TOKEN_ALGORITHM]
    };

    try {
        if (token) {
            // Decode JWT
            let publicKey: Buffer;
            const dir = path.resolve(__dirname, './oauth-public.key');
            try {
                publicKey = fs.readFileSync('./oauth-public.key');
            } catch (err) {
                publicKey = fs.readFileSync(dir);
            }
            const { userId }: any = jwt.verify(token, publicKey, verifyOptions) || {};

            // eslint-disable-next-line no-param-reassign
            const user = await prisma.user({
                id: userId
            });

            return user;
        }
        throw new NotAuthenticatedError('Not authenticated');
    } catch (err) {
        // Catch and Propagate Token Error
        if (err instanceof TokenExpiredError) {
            throw new NotAuthenticatedError('provided token has expired', err);
        } else if (err instanceof NotBeforeError) {
            throw new NotAuthenticatedError(`provided token cannot be used before ${err.date.toISOString()}`, err);
        } else {
            throw new BadRequestError(err.message);
        }
    }
};

export default verifyToken;
