import { Module } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { ArticlesController } from './articles.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { CategoriesModule } from 'src/categories/categories.module';

@Module({
  imports: [PrismaModule, CategoriesModule],
  controllers: [ArticlesController],
  providers: [ArticlesService],
  exports: [ArticlesService],
})
export class ArticlesModule {}
