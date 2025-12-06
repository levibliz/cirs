import { Injectable, Inject } from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { UpdateReportDto } from './dto/update-report.dto';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class ReportsService {
  constructor(@Inject('SUPABASE_CLIENT') private readonly supabase: SupabaseClient) {}

  async createReport(data: CreateReportDto, userId: string) {
    const { data: created, error } = await this.supabase
      .from('reports')
      .insert([
        {
          ...data,
          user_id: userId,
          image_url: data.imageUrl,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error) throw error;
    return {
      id: created.id,
      title: created.title,
      description: created.description,
      category: created.category,
      location: created.location,
      status: created.status,
      imageUrl: created.image_url,
      createdAt: created.created_at,
    };
  }

  async getAllReports() {
    const { data, error } = await this.supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    return data.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      location: r.location,
      status: r.status,
      imageUrl: r.image_url,
      createdAt: r.created_at,
    }));
  }

  async getReport(id: string) {
    const { data, error } = await this.supabase
      .from('reports')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      status: data.status,
      imageUrl: data.image_url,
      createdAt: data.created_at,
    };
  }

  async updateReport(id: string, dto: UpdateReportDto) {
    const updateData: any = { updated_at: new Date().toISOString() };
    
    if (dto.title) updateData.title = dto.title;
    if (dto.description) updateData.description = dto.description;
    if (dto.status) updateData.status = dto.status;
    if (dto.location) updateData.location = dto.location;
    if (dto.imageUrl !== undefined) updateData.image_url = dto.imageUrl;

    const { data, error } = await this.supabase
      .from('reports')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      category: data.category,
      location: data.location,
      status: data.status,
      imageUrl: data.image_url,
      createdAt: data.created_at,
    };
  }

  async deleteReport(id: string) {
    const { error } = await this.supabase
      .from('reports')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { message: 'Report deleted successfully' };
  }
}