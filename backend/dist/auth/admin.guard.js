"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminGuard = void 0;
const common_1 = require("@nestjs/common");
class AdminGuard {
    canActivate(context) {
        const req = context.switchToHttp().getRequest();
        if (req.user?.publicMetadata?.role !== 'admin') {
            throw new common_1.ForbiddenException('Admin-only route');
        }
        return true;
    }
}
exports.AdminGuard = AdminGuard;
//# sourceMappingURL=admin.guard.js.map