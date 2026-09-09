import { Module } from '@nestjs/common';
import { ShoppingLinesService } from './shopping_lines.service';
import { ShoppingLinesController } from './shopping_lines.controller';
import { TasksModule } from 'src/tasks/tasks.module';

@Module({
  imports: [TasksModule],
  controllers: [ShoppingLinesController],
  providers: [ShoppingLinesService],
})
export class ShoppingLinesModule {}
