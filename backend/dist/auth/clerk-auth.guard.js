"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var ClerkAuthGuard_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClerkAuthGuard = void 0;
const common_1 = require("@nestjs/common");
const jwt = __importStar(require("jsonwebtoken"));
const jwks_rsa_1 = __importDefault(require("jwks-rsa"));
let ClerkAuthGuard = ClerkAuthGuard_1 = class ClerkAuthGuard {
    constructor() {
        this.logger = new common_1.Logger(ClerkAuthGuard_1.name);
        this.issuer = process.env.CLERK_ISSUER || 'https://settled-beagle-1.clerk.accounts.dev';
        this.audience = process.env.CLERK_AUDIENCE || 'http://localhost:3000';
        this.client = (0, jwks_rsa_1.default)({
            jwksUri: `${this.issuer}/.well-known/jwks.json`,
            cache: true,
            cacheMaxEntries: 5,
            cacheMaxAge: 10 * 60 * 1000,
        });
    }
    async canActivate(context) {
        const req = context.switchToHttp().getRequest();
        const authHeader = req.headers['authorization'] || req.headers['Authorization'];
        if (!authHeader || Array.isArray(authHeader)) {
            if (process.env.NODE_ENV !== 'production')
                this.logger.debug('Missing Authorization header');
            throw new common_1.UnauthorizedException('Missing Authorization header');
        }
        const token = authHeader.replace(/^Bearer\s+/i, '').trim();
        if (!token) {
            if (process.env.NODE_ENV !== 'production')
                this.logger.debug('Empty Bearer token');
            throw new common_1.UnauthorizedException('Missing token');
        }
        // Decode without verifying so we can inspect header/payload
        const decoded = jwt.decode(token, { complete: true });
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
        const kid = decoded?.header?.kid;
        if (!kid) {
            if (process.env.NODE_ENV !== 'production')
                this.logger.warn('Token header has no kid');
            throw new common_1.UnauthorizedException('Invalid token header');
        }
        try {
            // fetch JWKS keys and find matching kid
            const keys = await this.client.getSigningKeys();
            const kids = keys.map((k) => k.kid || k?.kid);
            if (process.env.NODE_ENV !== 'production')
                this.logger.debug(`Available JWKS kids: ${JSON.stringify(kids)}`);
            const signingKeyObj = keys.find((k) => k.kid === kid || k?.kid === kid);
            if (!signingKeyObj) {
                if (process.env.NODE_ENV !== 'production')
                    this.logger.warn(`Signing key for kid=${kid} not found in JWKS`);
                throw new common_1.UnauthorizedException('Signing key not found');
            }
            const signingKey = typeof signingKeyObj.getPublicKey === 'function'
                ? signingKeyObj.getPublicKey()
                : signingKeyObj.rsaPublicKey || signingKeyObj.publicKey;
            if (!signingKey) {
                if (process.env.NODE_ENV !== 'production')
                    this.logger.warn('Signing key object does not expose a public key');
                throw new common_1.UnauthorizedException('Invalid signing key');
            }
            // Verify token; if you're testing locally and audience mismatch is likely,
            // you can temporarily remove 'audience' from options to check.
            const verifyOptions = {
                algorithms: ['RS256'],
                issuer: this.issuer,
                audience: this.audience,
            };
            let payload;
            try {
                payload = jwt.verify(token, signingKey, verifyOptions);
            }
            catch (verifyErr) {
                // If verify failed, log reason in dev for diagnosis then rethrow a friendly error
                if (process.env.NODE_ENV !== 'production') {
                    this.logger.warn('JWT verify failed', verifyErr);
                    // Try verifying without audience to see if audience was the problem (dev-only)
                    try {
                        const payloadNoAud = jwt.verify(token, signingKey, {
                            algorithms: ['RS256'],
                            issuer: this.issuer,
                        });
                        this.logger.warn('Token verifies without audience check (audience mismatch).');
                    }
                    catch (e2) {
                        this.logger.warn('Still failing without audience:', e2);
                    }
                }
                throw new common_1.UnauthorizedException('Invalid or expired token');
            }
            // success
            req.user = payload;
            if (process.env.NODE_ENV !== 'production') {
                this.logger.debug(`Verified JWT payload sub=${payload?.sub}`);
            }
            return true;
        }
        catch (err) {
            // Generic unauthorized after the above warnings/logging
            if (process.env.NODE_ENV !== 'production')
                this.logger.error('Auth failure', err);
            throw new common_1.UnauthorizedException('Invalid or expired token');
        }
    }
};
exports.ClerkAuthGuard = ClerkAuthGuard;
exports.ClerkAuthGuard = ClerkAuthGuard = ClerkAuthGuard_1 = __decorate([
    (0, common_1.Injectable)()
], ClerkAuthGuard);
//# sourceMappingURL=clerk-auth.guard.js.map