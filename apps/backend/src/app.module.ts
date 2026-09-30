import { Module } from '@nestjs/common';
import { HealthController } from './health/health.controller.js';
import { TodosController } from './todos/todos.controller.js';
import { TodosService } from './todos/todos.service.js';

@Module({
  controllers: [HealthController, TodosController],
  providers: [TodosService],
})
export class AppModule {}
