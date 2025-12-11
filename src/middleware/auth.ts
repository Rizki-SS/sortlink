import { jwtVerify, createRemoteJWKSet } from 'jose';
import { Elysia } from 'elysia';
import { UnauthorizedError } from '../types/errors';

export const JWK_URL = process.env.JWK_URL || 'https://example.com/.well-known/jwks.json';

export const authMiddleware = new Elysia({ name: 'auth' })
  .derive({ as: "scoped" }, async ({ request, set }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid Authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    try {
      const JWKS = createRemoteJWKSet(new URL(JWK_URL));

      const { payload } = await jwtVerify(token, JWKS);
      
      return {
        store: {
          user: payload
        }
      };
    } catch (err: Error | unknown) {
      throw new UnauthorizedError(err instanceof Error ? err.message : 'Invalid or expired token');
    }
  });
