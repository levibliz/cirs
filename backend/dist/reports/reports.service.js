"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_js_1 = require("@supabase/supabase-js");
let ReportsService = class ReportsService {
    constructor(supabase) {
        this.supabase = supabase;
    }
    async createReport(data, userId) {
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
        if (error)
            throw error;
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
        if (error)
            throw error;
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
    async getReport(id) {
        const { data, error } = await this.supabase
            .from('reports')
            .select('*')
            .eq('id', id)
            .single();
        if (error)
            throw error;
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
    async updateReport(id, dto) {
        const updateData = { updated_at: new Date().toISOString() };
        if (dto.title)
            updateData.title = dto.title;
        if (dto.description)
            updateData.description = dto.description;
        if (dto.status)
            updateData.status = dto.status;
        if (dto.location)
            updateData.location = dto.location;
        if (dto.imageUrl !== undefined)
            updateData.image_url = dto.imageUrl;
        const { data, error } = await this.supabase
            .from('reports')
            .update(updateData)
            .eq('id', id)
            .select()
            .single();
        if (error)
            throw error;
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
    async deleteReport(id) {
        const { error } = await this.supabase
            .from('reports')
            .delete()
            .eq('id', id);
        if (error)
            throw error;
        return { message: 'Report deleted successfully' };
    }
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SUPABASE_CLIENT')),
    __metadata("design:paramtypes", [supabase_js_1.SupabaseClient])
], ReportsService);
//# sourceMappingURL=reports.service.js.map