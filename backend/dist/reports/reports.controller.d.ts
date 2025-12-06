import { Request } from 'express';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
    create(dto: CreateReportDto, req: Request & {
        user: any;
    }): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }>;
    findAll(): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }[]>;
    findOne(id: string): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }>;
    update(id: string, dto: UpdateReportDto, req: Request & {
        user: any;
    }): Promise<{
        id: any;
        title: any;
        description: any;
        category: any;
        location: any;
        status: any;
        imageUrl: any;
        createdAt: any;
    }>;
    delete(id: string): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=reports.controller.d.ts.map