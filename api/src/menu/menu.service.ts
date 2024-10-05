import { Injectable } from '@nestjs/common';
import { CreateMenuDto } from './dto/create-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class MenuService {
  constructor(private prisma: PrismaService) {}

  async create(createMenuDto: CreateMenuDto) {
    try {
      const menu = await this.prisma.menu.create({
        data: createMenuDto,
      });

      const rootItem = await this.prisma.item.create({
        data: {
          name: 'root',
          depth: 0,
          menuId: menu.id,
        },
      });

      return { menu, items: [rootItem] };
    } catch (error) {
      throw error;
    }
  }

  findAll() {
    return this.prisma.menu.findMany();
  }

  findOne(id: string) {
    return this.prisma.menu.findFirst({
      where: {
        id,
      },
      include: {
        items: {
          where: {
            depth: {
              lte: 1,
            },
          },
        },
      },
    });
  }

  update(id: string, updateMenuDto: UpdateMenuDto) {
    return this.prisma.menu.update({
      data: updateMenuDto,
      where: { id },
    });
  }

  remove(id: string) {
    return this.prisma.menu.delete({
      where: { id },
    });
  }
}
