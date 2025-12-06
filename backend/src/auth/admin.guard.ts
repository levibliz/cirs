import { CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';

export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();

    if (req.user?.publicMetadata?.role !== 'admin') {
      throw new ForbiddenException('Admin-only route');
    }

    return true;
  }
}