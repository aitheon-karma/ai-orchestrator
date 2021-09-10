import { Get, Post, Delete, Body, Param, Put, QueryParam, Res, Req, JsonController, Authorized, CurrentUser } from 'routing-controllers';
import { Inject } from 'typedi';
import { ObjectId } from 'mongodb';
import { TasksService } from './tasks.service';
import { Task, TaskSchema } from './task.model';
import { Request, Response } from 'express';
import { Current } from '@aitheon/core-server';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';
import { TrackerApi } from '@aitheon/hr-server';
import { ProjectsApi, Project, ProjectTasksApi } from '@aitheon/project-manager-server';
import * as mongoose from 'mongoose';
import moment = require('moment');
require('../shared/model/project.model');

@Authorized()
@JsonController('/api/tasks')
export class TasksController {

  trackerApi: TrackerApi;
  projectApi: ProjectsApi;
  projectTaskApi: ProjectTasksApi;

  constructor() {
    this.trackerApi = new TrackerApi(`https://${process.env.DOMAIN || 'dev.aitheon.com'}/hr`);
    this.projectApi = new ProjectsApi(`https://${process.env.DOMAIN || 'dev.aitheon.com'}/project-manager`);
    this.projectTaskApi = new ProjectTasksApi(`https://${process.env.DOMAIN || 'dev.aitheon.com'}/project-manager`);

  }

  @Inject()
  tasksService: TasksService;

  @Get('/')
  @OpenAPI({ summary: 'List of tasks by userId or organizationId', operationId: 'list' })
  @ResponseSchema(Task, { isArray: true })
  async list(@CurrentUser() current: Current, @Res() response: Response, @Req() request: Request, @QueryParam('isNotify') isNotify: boolean, @QueryParam('type') type: string, @QueryParam('algorithmic') algorithmic: boolean) {
    const organizationId = current.organization ? current.organization._id : undefined;
    const userId = isNotify ? current.user._id : '';
    let projectData: any;
    if (organizationId) {
      projectData = await this.projectApi.list(undefined, true, { headers: { 'Authorization': `JWT ${current.token}`, 'organization-id': current.organization._id } });
    }
    const tasks = organizationId ? await this.tasksService.findByOrg(organizationId, request.query, userId, type, algorithmic, projectData.response.body) :
      await this.tasksService.findByUser(current.user._id, request.query, isNotify, type, algorithmic);
    return response.json(tasks);
  }

  @Post('/')
  @OpenAPI({ summary: 'Create a new task', operationId: 'create' })
  @ResponseSchema(Task)
  async create(@CurrentUser() current: Current,
    @Body() task: Task,
    @Res() response: Response) {
    task.createdBy = current.user;
    const result = await this.tasksService.create(task);
    return response.json(result);
  }


  @Get('/:id')
  @OpenAPI({ summary: 'Fetch a task', operationId: 'getById' })
  @ResponseSchema(Task)
  async getById(@Param('id') id: string, @Res() response: Response) {
    const result = await this.tasksService.findById(id);
    return response.json(result);
  }


  @Put('/:id')
  @OpenAPI({ summary: 'Edit a task', operationId: 'update' })
  @ResponseSchema(Task)
  async update(@Param('id') id: string, @CurrentUser() current: Current, @Body() task: Task, @Res() response: Response) {
    task._id = task._id || id;
    const updatedTask = await this.tasksService.update(task);
    return response.json(updatedTask);
  }


  @Delete('/:id')
  @OpenAPI({ summary: 'Delete a task', operationId: 'remove' })
  async remove(@Param('id') id: string, @QueryParam('board') board: string, @CurrentUser() current: Current, @Res() response: Response) {
    const result = await this.tasksService.remove(id, board);
    return response.sendStatus(204);
  }



  @Delete('/:referenceId/reference')
  @OpenAPI({ summary: 'Delete by ReferenceId', operationId: 'removeByReferenceId' })
  async removeByRefId(@Param('referenceId') referenceId: string, @CurrentUser() current: Current, @Res() response: Response) {
    const organization = current.organization ? current.organization._id : undefined;

    if (!organization) {
      return response.sendStatus(403);
    }

    await this.tasksService.removeByRefId(referenceId);
    return response.sendStatus(204);
  }


  @Post('/delete/references')
  @OpenAPI({ summary: 'Delete by ReferenceIds', operationId: 'removeByReferenceIds' })
  async removeByRefIds(@Body() referenceIds: string[], @CurrentUser() current: Current, @Res() response: Response) {

    const organization = current.organization ? current.organization._id : undefined;

    if (!organization) {
      return response.sendStatus(403);
    }

    await this.tasksService.removeByRefIds(referenceIds, organization);
    return response.sendStatus(204);
  }


  @Delete('/delete/multiple')
  @OpenAPI({ summary: 'Delete multiple task by TaskId', operationId: 'removeMany' })
  async removeMany(
    @QueryParam('taskIds') taskIds: string,
    @QueryParam('assignedToIds') assignedToIds: string,
    @CurrentUser() current: Current,
    @Res() response: Response
  ) {
    const arrayOfTaskIds: Array<ObjectId> = taskIds.split(',').map(taskId => new ObjectId(taskId));
    let arrayOfAssignedToIds: Array<string> = [];
    if (assignedToIds) { arrayOfAssignedToIds = assignedToIds.split(',').map(assignedToId => assignedToId); }
    await this.tasksService.removeMany(arrayOfTaskIds, arrayOfAssignedToIds);
    return response.sendStatus(204);
  }

  @Post('/:id/start')
  @OpenAPI({ summary: 'Start timer tracking for a task', operationId: 'start' })
  @ResponseSchema(Task)
  async start(@CurrentUser() current: Current, @Param('id') id: string, @Res() response: Response) {
    const userId = current.user._id;
    const task = await this.tasksService.findById(id);

    let isStarted = false;

    if (Array.isArray(task.loggedTime)) {
      task.loggedTime.forEach(time => {
        if (time.user && time.user.toString() === userId && !time.endTime) {
          isStarted = true;
        }
      });
    }

    if (isStarted) {
      return response.status(500).json({
        error: 'Task time is already started. Please refresh page'
      });
    }

    task.loggedTime.push({
      startTime: new Date(),
      user: userId
    });

    await (task as any).save();

    const result: any = await this.tasksService.findById(id);
    return response.json(result);
  }



  @Post('/:id/stop')
  @OpenAPI({ summary: 'Stop timer tracking for a task', operationId: 'stop' })
  @ResponseSchema(Task)
  async stop(@CurrentUser() current: Current, @Param('id') id: string, @Res() response: Response) {
    const userId = current.user._id;
    const task = await this.tasksService.findById(id);

    let prevTime;
    let started;

    if (Array.isArray(task.loggedTime)) {
      for (const time of task.loggedTime) {
        if (time.user && time.user.toString() === userId) {
          if (!time.endTime) {
            started = time;
            break;
          } else {
            prevTime = time;
          }
        }
      }
    }

    if (!started) {
      return response.status(500).json({
        error: 'Task time is already stopped. Please refresh page'
      });
    }

    if (!prevTime) {
      prevTime = {
        totalTime: 0
      };
    }
    started.endTime = new Date();

    const startTime = new Date(started.startTime).getTime();
    started.totalTime = Math.floor((Date.now() - startTime) / 1000) + prevTime.totalTime;
    await (task as any).save();
    const result: any = await this.tasksService.findById(id);
    return response.json(result);
  }

  @Get('/:organizationId/task')
  @OpenAPI({ summary: 'Get already started task for organization', operationId: 'getStartedTask' })
  @ResponseSchema(Task)
  async getStartedTask(@CurrentUser() current: Current, @Param('organizationId') organizationId: string, @Res() response: Response) {
    const result = await this.tasksService.getStartedTask(organizationId, current.user._id);
    return response.json(result);
  }


  @Put('/update/data')
  @OpenAPI({ summary: 'Update task by action data condition', operationId: 'updateTaskByActionData' })
  @ResponseSchema(Task)
  async updateTaskByActionData(@CurrentUser() current: Current, @Body() condition: any, @Res() response: Response, @Req() request: Request) {
    const updatedTaskData = await this.tasksService.updateByCondition(condition);
    return response.status(200).json(updatedTaskData);
  }

  @Put('/assign/me')
  @OpenAPI({ summary: 'Assign task to me', operationId: 'assignToMe' })
  @ResponseSchema(Task)
  async assignToMe(@CurrentUser() current: Current, @Body() task: Task, @Res() response: Response, @Req() request: Request) {
    const updatedTaskData = await this.tasksService.assignToMe(task._id, current.user._id);
    return response.status(200).json(updatedTaskData);
  }

  @Post('/notifications/read')
  @OpenAPI({ summary: 'Mark notifications as read', operationId: 'markAsRead' })
  async markAsRead(@CurrentUser() current: Current, @Res() response: Response, @Req() request: Request, @Body() body: any) {
    const userId = current.user._id;
    const tasks = body.tasks;
    for (const taskId of tasks) {
      await this.tasksService.markAsRead(taskId, userId);
    }
    return response.status(200).json({});
  }



  @Post('/notifications/done')
  @OpenAPI({ summary: 'Mark task as done and dismiss', operationId: 'markAsDone' })
  async markAsDone(@CurrentUser() current: Current, @Res() response: Response, @Req() request: Request, @Body() body: any) {
    const userId = current.user._id;
    const tasks = body.tasks;
    for (const taskId of tasks) {
      const orchestratorTask = await this.tasksService.markAsDone(taskId, userId);
      if (orchestratorTask.service == 'PROJECT_MANAGER') {
        this.projectTaskApi.markAsDone(orchestratorTask._id, {}, { headers: { 'Authorization': `JWT ${current.token}`, 'organization-id': current.organization._id } });
      }
    }
    return response.status(200).json({});
  }

  @Post('/notifications/undone')
  @OpenAPI({ summary: 'Mark task as undone and undismiss', operationId: 'markAsUnDone' })
  async markAsUnDone(@CurrentUser() current: Current, @Res() response: Response, @Req() request: Request, @Body() body: any) {
    const userId = current.user._id;
    const taskIds = body.tasks;
    const orchestratorTask = await this.tasksService.markAsUnDone(taskIds, userId);
    return response.status(204);
  }


  @Get('/tasks/filter')
  @OpenAPI({ description: 'Get task list by filter', operationId: 'taskList' })
  async taskList(@CurrentUser() current: Current, @QueryParam('type') type: string, @QueryParam('service') service: string, @QueryParam('pageNo') pageNo: number, @QueryParam('searchText') searchText: string, @QueryParam('searchState') searchState: string, @QueryParam('size') size: number, @Res() response: Response, @Req() request: Request) {
    try {
      // if organization exist
      if (current.organization) {
        let condition: any = {}, skip;
        // if page no is invalid return error message
        if (pageNo < 0 || pageNo === 0) {
          return response.json({
            'error': true,
            'message': 'invalid page number, should start with 1'
          });
        } else if (pageNo == undefined) {
          pageNo = 1;
        }
        if (size && pageNo > 0) {
          skip = Number(size * (pageNo - 1));
        }
        else {
          skip = Number(10 * (pageNo - 1));
        }

        // Create condition to get task by filter
        if (type != '' && type != undefined) {
          if (searchState == 'All' || searchState == undefined || searchState == '') {
            condition = { 'organization': current.organization._id, 'action.name': type };
          }
          else {
            condition = { 'organization': current.organization._id, 'action.name': type, 'state': searchState };
          }
        }
        else if ((searchText == undefined || searchText == '') && (searchState == '' || searchState == undefined)) {
          condition = { 'organization': current.organization._id };
          if (service) {
            condition['service'] = service;
          }
        }
        else if ((searchState != '' || searchState != undefined) && (searchText == '' || searchText == undefined)) {
          condition = { 'state': searchState, 'organization': current.organization._id };
          if (service) {
            condition['service'] = service;
          }
        }
        else {
          if (searchState == '' || searchState == undefined) {
            condition = {
              organization: current.organization._id,
              name: { $regex: searchText, $options: 'i' },
            };
            if (service) {
              condition['service'] = service;
            }
          }
          else {
            condition = {
              organization: current.organization._id,
              state: searchState
            };
            if (service) {
              condition['service'] = service;
            }
          }
        }
        // find all tasks by filter and return response
        const tasks = await this.tasksService.findAllTasks(condition, skip, size);
        return response.json(tasks);
      } else {
        return response.status(500).json({
          message: 'Undefined organization'
        });
      }
    }
    catch (error) {
      return response.status(500).json({
        message: error.message || 'Something went wrong'
      });
    }
  }

  // Fetch task for Robo
  @Post('/robo/fetch')
  @OpenAPI({ summary: 'Get task by filter', operationId: 'getBySystem' })
  @ResponseSchema(Task)
  async getBySystem(@CurrentUser() current: Current, @Body() body: any, @Req() request: Request, @Res() response: Response) {
    let query: any;
    try {
      if (current.organization && current.organization._id) {
        if (body.fromSystem) {
          query = {
            'action.data.fromSystem': body.fromSystem,
            'state': 'PENDING',
            organization: current.organization._id,
          };
        }
        else {
          query = {
            service: 'SMART_INFRASTRUCTURE',
            state: 'PENDING',
            organization: current.organization._id,
            parentTask: { $exists: false }
          };
        }
        const task = await this.tasksService.getByFilter(query);
        if (task && task._id) {
          return response.json(task);
        }
        else {
          return response.status(204).send();
        }
      }
      else {
        return response.status(400).json({ status: 'ERROR', message: 'Request is missing organization header' });
      }
    }
    catch (err) {
      return response.json({
        message: err.message || 'Something went wrong'
      });
    }
  }

  @Post('/customTask')
  @OpenAPI({ summary: 'Create a new custom task', operationId: 'createCustomTask' })
  @ResponseSchema(Task)
  async createCustomTask(@CurrentUser() current: Current, @Body() poses: any, @Res() response: Response) {
    // Create parent task
    const parentTaskData: any = {
      name: 'CUSTOM_ROBO_TASK',
      description: 'Move robo through the n defined points',
      service: poses.service,
      assignedToSystem: poses.assignedToSystem,
      organization: current.organization,
      state: poses.state,
      type: poses.type
    };
    const parentTask = await this.tasksService.create(parentTaskData);
    if (parentTask) {
      const tasksArray: any = [];
      for (const point of poses.action.data) {
        const task: any = {
          'name': 'MOVE_ROBO',
          'description': 'Move robo',
          'parentTask': parentTask._id,
          'service': poses.service,
          'action.data': point,
        };
        const subTask = await this.tasksService.create(task);
        tasksArray.push({ task: subTask._id, dependencyType: 'subTask' });
      }
      const updateParentData: any = {
        '_id': parentTask._id,
        'dependencies': tasksArray
      };
      const updateParent = await this.tasksService.update(updateParentData);
      return response.json({ 'Message': 'Successfully created the tasks.', 'data': updateParent });
    } else {
      return response.json({ 'Message': 'Error while creating parent task' });
    }
  }


  @Post('/employees/workload')
  @OpenAPI({ summary: 'Fetch workload tasks for employees', operationId: 'getWorkloadTasks' })
  @ResponseSchema(Task, { isArray: true })
  async getWorkloadTasks(@CurrentUser() current: Current, @Body() body: any, @Req() request: Request, @Res() response: Response) {
    const organizationId = current.organization._id;
    const result = await this.tasksService.findWorkload(organizationId, body);
    return response.json(result);
  }


  @Get('/organization/:organizationId/employees/effective-time/period')
  @OpenAPI({ summary: 'Fetch effective time for employees', operationId: 'getEffectiveTime' })
  async getEffectiveTime(@CurrentUser() current: Current, @Param('organizationId') organizationId: string, @QueryParam('startDate') startDate: string, @QueryParam('endDate') endDate: string, @Req() request: Request, @Res() response: Response) {
    try {
      const params: any = {
        'startDate': startDate,
        'endDate': endDate
      };
      const employeeTracker: any = await this.trackerApi.allEmployeeTrackerByPeriod(organizationId, params.startDate, params.endDate, { headers: { 'Authorization': `JWT ${current.token}`, 'organization-id': organizationId } });
      const ids = employeeTracker.response.body.map((el: any) => mongoose.Types.ObjectId(el.employee.user));
      params.ids = ids;
      const result = await this.tasksService.findEffectiveTime(organizationId, params);
      return response.json({
        'overheadTime': employeeTracker.response.body,
        'effectiveTime': result
      });
    } catch (error) {
      return response.sendStatus(204).json({
        'error': error.message || 'Something went wrong'
      });
    }
  }
}
