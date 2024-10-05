import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from 'prisma/prisma.module';
import { MenuModule } from './menu/menu.module';
import { ItemModule } from './item/item.module';

@Module({
  imports: [PrismaModule, MenuModule, ItemModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
