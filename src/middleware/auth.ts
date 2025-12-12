import { jwtVerify, createLocalJWKSet } from 'jose';
import { redisClient } from '../modules/shorlinks/config/redis';
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
      let jwkData: any;
      const cachedJwk = await redisClient.get('jwk_cache_key');

      if (cachedJwk) {
        jwkData = JSON.parse(cachedJwk);
      } else {
        const response = await fetch(JWK_URL);
        jwkData = await response.json();
        await redisClient.set('jwk_cache_key', JSON.stringify(jwkData), 'EX', 3600);
      }

      const JWKS = createLocalJWKSet(jwkData);

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
