import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { ReportsService } from './reports.service';
import { ClerkAuthGuard } from '../auth/clerk-auth.guard';
import { AdminGuard } from '../auth/admin.guard';

@Controller('api/report')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  // Create report
  @UseGuards(ClerkAuthGuard)
  @Post()
  create(@Body() dto: CreateReportDto, @Req() req: Request & { user: any }) {
    return this.reportsService.createReport(dto, req.user.sub);
  }

  // Get all reports
  @UseGuards(ClerkAuthGuard)
  @Get()
  findAll() {
    return this.reportsService.getAllReports();
  }

  // Get single report
  @UseGuards(ClerkAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reportsService.getReport(id);
  }

  // Update report (PATCH endpoint - flexible updates)
  @UseGuards(ClerkAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateReportDto,
    @Req() req: Request & { user: any },
  ) {
    return this.reportsService.updateReport(id, dto);
  }

  // Delete report (admin only)
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.reportsService.deleteReport(id);
  }
}