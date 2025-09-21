import {
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  IsBoolean,
} from 'class-validator';

// ✅ CREATE
export class CreateActionDto {
  @IsString()
  @MinLength(1, { message: 'Code is required' })
  @MaxLength(10)
  code: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// ✅ UPDATE
export class UpdateActionDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(10)
  code?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

// ✅ DELETE
export class DeleteActionDto {
  @IsOptional()
  @IsBoolean()
  hard?: boolean = false;
}
