import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class ItemService {
  constructor(private prisma: PrismaService) {}

  create(createItemDto: any) {
    return this.prisma.item.create({
      data: createItemDto,
    });
  }

  findAll(query: any) {
    let where: any = {};

    if (query.parentId) where.parentId = query.parentId;

    if (query.parentIds)
      where.parentId = {
        in: query.parentIds.split(','),
      };

    if (query.depth && !isNaN(+query.depth))
      where.depth = {
        lte: +query.depth + 2,
      };

    if (query.excludeIds)
      where.id = {
        notIn: query.excludeIds.split(','),
      };

    if (query.menuId) where.menuId = query.menuId;

    console.log(where);

    return this.prisma.item.findMany({
      where,
    });
  }

  findOne(id: string) {
    return this.prisma.item.findFirst({
      where: {
        id,
      },
      include: {
        children: true,
      },
    });
  }

  update(id: string, updateItemDto: any) {
    return this.prisma.item.update({
      data: updateItemDto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.item.delete({
      where: { id },
    });
  }
}
