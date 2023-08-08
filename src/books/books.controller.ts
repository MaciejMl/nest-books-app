import {
  Controller,
  Get,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
  Body,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDTO } from './dtos/create.book.dto';
import { UpdateBookDTO } from './dtos/update.book.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { LikeBookDTO } from './dtos/like.book.dto';

@Controller('books')
export class BooksController {
  constructor(private bookService: BooksService) {}

  @Get('/')
  getAll() {
    return this.bookService.getAll();
  }

  @Get('/:id')
  async getById(@Param('id', new ParseUUIDPipe()) id: string) {
    const book = await this.bookService.getById(id);
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  @UseGuards(JwtAuthGuard)
  @Delete('/:id')
  async delete(@Param('id', new ParseUUIDPipe()) id: string) {
    if (!(await this.bookService.getById(id)))
      throw new NotFoundException('Book not found');
    await this.bookService.delete(id);
    return { success: true };
  }

  @UseGuards(JwtAuthGuard)
  @Post('/')
  create(@Body() bookData: CreateBookDTO) {
    return this.bookService.create(bookData);
  }

  @UseGuards(JwtAuthGuard)
  @Post('/like')
  async likeBook(@Body() likeData: LikeBookDTO) {
    await this.bookService.likeBook(likeData.bookId, likeData.userId);
    return { seccess: true };
  }

  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  async update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() bookData: UpdateBookDTO,
  ) {
    if (!(await this.bookService.getById(id)))
      throw new NotFoundException('Book not found');

    await this.bookService.update(id, bookData);
    return { success: true };
  }
}
