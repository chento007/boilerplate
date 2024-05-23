import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskStatus } from './tasks-status.enum';
import { CreateTaskDTO } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-task-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task.dto';
import { Task } from './tasks.entity';
import { ApiTags } from '@nestjs/swagger';

@Controller('api/v1/tasks')
@ApiTags('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  public getAllTasks(@Query() filterDto: GetTaskFilterDto): Promise<Task[]> {
    return this.tasksService.getAllTasks();
  }

  @Post()
  public createTask(
    @Body() createTaskDTO: CreateTaskDTO,
  ): Promise<CreateTaskDTO> {
    return this.tasksService.createTask(createTaskDTO);
  }

  @Get('/:id')
  public getTaskById(@Param('id') id: number): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Delete('/:id')
  public removeById(@Param('id') id: number): Promise<void> {
    return this.tasksService.removeById(id);
  }

  @Put('/:id/status')
  public updateTaskStatus(
    @Param('id') id: number,
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
  ): Promise<Task> {
    return this.tasksService.updateTaskStatus(id, updateTaskStatusDto.status);
  }
}
