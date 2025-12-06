"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupabaseProvider = exports.SupabaseFactory = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const config_1 = require("@nestjs/config");
const SupabaseFactory = (config) => {
    const supabaseUrl = config.get('NEXT_PUBLIC_SUPABASE_URL');
    const supabaseKey = config.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Missing Supabase environment variables');
    }
    return (0, supabase_js_1.createClient)(supabaseUrl, supabaseKey);
};
exports.SupabaseFactory = SupabaseFactory;
// Export as provider for NestJS
exports.SupabaseProvider = {
    provide: 'SUPABASE_CLIENT',
    inject: [config_1.ConfigService],
    useFactory: exports.SupabaseFactory,
};
//# sourceMappingURL=supabase.client.js.map