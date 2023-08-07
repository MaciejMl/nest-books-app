import { Transform } from 'class-transformer';
import {
  Min,
  Max,
  IsNotEmpty,
  IsString,
  Length,
  IsUUID,
  IsInt,
} from 'class-validator';

export class UpdateBookDTO {
  @IsNotEmpty()
  @IsString()
  @Length(3, 100)
  title: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Max(5)
  @Transform(({ value }) => parseInt(value))
  rating: number;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @Max(1000)
  @Transform(({ value }) => parseInt(value))
  price: number;

  @IsNotEmpty()
  @IsUUID()
  @IsString()
  authorId: string;
}
