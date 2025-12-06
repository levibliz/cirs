import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

export const SupabaseFactory = (config: ConfigService) => {
  const supabaseUrl = config.get('NEXT_PUBLIC_SUPABASE_URL');
  const supabaseKey = config.get('SUPABASE_SERVICE_ROLE_KEY');

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
  }

  return createClient(supabaseUrl, supabaseKey);
};

// Export as provider for NestJS
export const SupabaseProvider = {
  provide: 'SUPABASE_CLIENT',
  inject: [ConfigService],
  useFactory: SupabaseFactory,
};