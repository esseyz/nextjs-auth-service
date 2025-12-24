import { IsOptional, IsString } from 'class-validator';

export class EditBookmarkDto {
  @IsString()
  @IsOptional() // Critical: Allows you to update WITHOUT sending this field
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional() // Critical: This is what caused your 400 error
  link?: string;
}
