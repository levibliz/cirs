import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class ClerkAuthGuard implements CanActivate {
    private readonly logger;
    private issuer;
    private audience;
    private client;
    canActivate(context: ExecutionContext): Promise<boolean>;
}
//# sourceMappingURL=clerk-auth.guard.d.ts.map