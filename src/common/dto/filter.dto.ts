import { Transform, Type } from 'class-transformer';
import {
  IsOptional,
  IsEnum,
  IsBoolean,
  IsInt,
  Min,
  IsString,
} from 'class-validator';

export class QueryFilterDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page number must be a positive integer' })
  @Min(1, { message: 'Page number must be a positive integer' })
  pageNum?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'Page size must be a positive integer' })
  @Min(1, { message: 'Page size must be a positive integer' })
  pageSize?: number;

  @IsOptional()
  @IsEnum(['asc', 'desc'], { message: 'Order must be either asc or desc' })
  order?: 'asc' | 'desc';

  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  isActive?: boolean = true;
}
