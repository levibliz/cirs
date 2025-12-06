import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseFactory } from '../supabase.client';
import { ReportsService } from './reports.service';
import { ReportsController } from './reports.controller';

@Module({
  providers: [
    ReportsService,
    {
      provide: 'SUPABASE_CLIENT',
      inject: [ConfigService],
      useFactory: SupabaseFactory,
    },
  ],
  controllers: [ReportsController],
})
export class ReportsModule {}