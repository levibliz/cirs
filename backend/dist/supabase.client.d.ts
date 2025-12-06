import { ConfigService } from '@nestjs/config';
export declare const SupabaseFactory: (config: ConfigService) => import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
export declare const SupabaseProvider: {
    provide: string;
    inject: (typeof ConfigService)[];
    useFactory: (config: ConfigService) => import("@supabase/supabase-js").SupabaseClient<any, "public", "public", any, any>;
};
//# sourceMappingURL=supabase.client.d.ts.map