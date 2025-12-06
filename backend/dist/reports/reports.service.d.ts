import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { SupabaseClient } from '@supabase/supabase-js';
export declare class ReportsService {
    private readonly supabase;
    constructor(supabase: SupabaseClient);
    createReport(data: CreateReportDto, userId: string): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }>;
    getAllReports(): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }[]>;
    getReport(id: string): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }>;
    updateReport(id: string, dto: UpdateReportDto): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }>;
    deleteReport(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=reports.service.d.ts.map