import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { Request } from 'express';
import * as jwt from 'jsonwebtoken';
import jwksClient from 'jwks-rsa';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  private issuer =
    process.env.CLERK_ISSUER || 'https://settled-beagle-1.clerk.accounts.dev';
  private audience = process.env.CLERK_AUDIENCE || 'http://localhost:3000';

  private client = jwksClient({
    jwksUri: `${this.issuer}/.well-known/jwks.json`,
    cache: true,
    cacheMaxEntries: 5,
    cacheMaxAge: 10 * 60 * 1000,
  });

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req: Request & { user?: any } = context.switchToHttp().getRequest();
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];

    if (!authHeader || Array.isArray(authHeader)) {
      if (process.env.NODE_ENV !== 'production')
        this.logger.debug('Missing Authorization header');
      throw new UnauthorizedException('Missing Authorization header');
    }

    const token = authHeader.replace(/^Bearer\s+/i, '').trim();
    if (!token) {
      if (process.env.NODE_ENV !== 'production')
        this.logger.debug('Empty Bearer token');
      throw new UnauthorizedException('Missing token');
    }

    // Decode without verifying so we can inspect header/payload
    const decoded = jwt.decode(token, { complete: true }) as any;
    if (process.env.NODE_ENV !== 'production') {
      this.logger.debug(`Decoded token header: ${JSON.stringify(decoded?.header)}`);
      this.logger.debug(`Decoded token payload (partial): ${JSON.stringify({
        iss: decoded?.payload?.iss,
        aud: decoded?.payload?.aud,
        azp: decoded?.payload?.azp,
        exp: decoded?.payload?.exp,
        sub: decoded?.payload?.sub,
      })}`);
    }

    const kid: string | undefined = decoded?.header?.kid;
    if (!kid) {
      if (process.env.NODE_ENV !== 'production')
        this.logger.warn('Token header has no kid');
      throw new UnauthorizedException('Invalid token header');
    }

    try {
      // fetch JWKS keys and find matching kid
      const keys = await this.client.getSigningKeys();
      const kids = (keys as any[]).map((k) => k.kid || k?.kid);
      if (process.env.NODE_ENV !== 'production')
        this.logger.debug(`Available JWKS kids: ${JSON.stringify(kids)}`);

      const signingKeyObj = (keys as any[]).find((k) => k.kid === kid || k?.kid === kid);
      if (!signingKeyObj) {
        if (process.env.NODE_ENV !== 'production')
          this.logger.warn(`Signing key for kid=${kid} not found in JWKS`);
        throw new UnauthorizedException('Signing key not found');
      }

      const signingKey =
        typeof signingKeyObj.getPublicKey === 'function'
          ? signingKeyObj.getPublicKey()
          : signingKeyObj.rsaPublicKey || signingKeyObj.publicKey;

      if (!signingKey) {
        if (process.env.NODE_ENV !== 'production')
          this.logger.warn('Signing key object does not expose a public key');
        throw new UnauthorizedException('Invalid signing key');
      }

      // Verify token signature and issuer first (do NOT force audience here)
      const verifyOptions: jwt.VerifyOptions = {
        algorithms: ['RS256'],
        issuer: this.issuer,
      };

      let payload: any;
      try {
        payload = jwt.verify(token, signingKey, verifyOptions);
      } catch (verifyErr) {
        if (process.env.NODE_ENV !== 'production') {
          this.logger.warn('JWT verify failed', verifyErr as any);
        }
        throw new UnauthorizedException('Invalid or expired token');
      }

      // Manually validate audience: some tokens may not populate `aud` but set `azp`.
      const tokenAud = payload?.aud;
      const tokenAzp = payload?.azp;
      const expectedAud = this.audience;

      const audMatches = ((): boolean => {
        if (!expectedAud) return true;
        if (!tokenAud && !tokenAzp) return false;
        if (Array.isArray(tokenAud)) return tokenAud.includes(expectedAud);
        if (typeof tokenAud === 'string') return tokenAud === expectedAud;
        if (typeof tokenAzp === 'string') return tokenAzp === expectedAud;
        return false;
      })();

      if (!audMatches) {
        if (process.env.NODE_ENV !== 'production') {
          this.logger.warn(
            `JWT audience invalid. expected: ${expectedAud}, got aud=${JSON.stringify(tokenAud)}, azp=${JSON.stringify(tokenAzp)}`,
          );
        }
        throw new UnauthorizedException('Token audience mismatch');
      }

      // success
      req.user = payload;
      if (process.env.NODE_ENV !== 'production') {
        this.logger.debug(`Verified JWT payload sub=${payload?.sub}`);
      }
      return true;
    } catch (err) {
      // Generic unauthorized after the above warnings/logging
      if (process.env.NODE_ENV !== 'production') this.logger.error('Auth failure', err as any);
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}
