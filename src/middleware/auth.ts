import { jwtVerify, createRemoteJWKSet } from 'jose';
import { Elysia } from 'elysia';

export const JWK_URL = process.env.JWK_URL || 'https://example.com/.well-known/jwks.json';

export const authMiddleware = new Elysia({ name: 'auth' })
  .derive({ as: "scoped" }, async ({ request, set }) => {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      set.status = 401;
      throw new Error('Missing or invalid Authorization header');
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
      set.status = 401;
      throw new Error(err instanceof Error ? err.message : 'Unknown error : Unauthorized');
    }
  });
