import {
  BadRequestException,
  Injectable,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Book, UserOnBooks } from '@prisma/client';

@Injectable()
export class BooksService {
  constructor(private prismaService: PrismaService) {}

  public getAll(): Promise<Book[]> {
    return this.prismaService.book.findMany({
      include: {
        author: true,
      },
    });
  }

  public getById(id: Book['id']): Promise<Book | null> {
    return this.prismaService.book.findUnique({
      where: { id },
      include: {
        author: true,
      },
    });
  }

  public delete(id: Book['id']): Promise<Book> {
    return this.prismaService.book.delete({
      where: { id },
    });
  }

  public async create(
    bookData: Omit<Book, 'id' | 'createdAt' | 'updateAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    const ifExist = await this.prismaService.author.findUnique({
      where: { id: authorId },
    });

    if (!ifExist) {
      throw new BadRequestException("Author doesn't exist");
    }

    try {
      return this.prismaService.book.create({
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
      throw error;
    }
  }

  public async update(
    id: Book['id'],
    bookData: Omit<Book, 'id' | 'createdAt' | 'updateAt'>,
  ): Promise<Book> {
    const { authorId, ...otherData } = bookData;
    try {
      return this.prismaService.book.update({
        where: { id },
        data: {
          ...otherData,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Title is already taken');
    }
  }

  public async likeBook(
    bookId: UserOnBooks['bookId'],
    userId: UserOnBooks['userId'],
  ): Promise<UserOnBooks | any> {
    try {
      return await this.prismaService.book.update({
        where: { id: bookId },
        data: {
          users: {
            create: {
              user: {
                connect: { id: userId },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error.code === 'P2002')
        throw new ConflictException('Like is already given');
    }
  }
}
