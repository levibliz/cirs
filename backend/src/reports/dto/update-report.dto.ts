import { IsOptional, IsString, IsIn, IsUrl } from 'class-validator';

export class UpdateReportDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  @IsIn(['pending', 'in-progress', 'resolved'])
  status?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}