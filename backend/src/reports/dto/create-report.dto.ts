import { IsNotEmpty, IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  category: string;

  @IsNotEmpty()
  @IsString()
  location: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
