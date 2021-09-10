import { Service, Inject } from 'typedi';
import { TaskSchema, Task, TaskType } from './task.model';
require('../core/user.model');
import { CoreServices } from '../shared/constants/core-services';
import * as async from 'async';
import * as moment from 'moment';
import { TransporterService, Event, Transporter, param } from '@aitheon/transporter';
import * as mongoose from 'mongoose';
import { ObjectId, Db } from 'mongodb';
import _ = require('lodash');
import { Current } from '@aitheon/core-server';
import { projectPopulateDefaults } from '../shared/model/project.model';
const XLSX = require('xlsx');
@Service()
@Transporter()
export class TasksService extends TransporterService {
  constructor(broker: any, schema?: any) {
    super(broker, schema);
  }

  @Event({ name: 'TasksService.createTask' })
  async createTask(taskData: Task, sender: any, event: any) {
    await this.create(taskData);
  }
  private prepareTaskReferences(task: Task) {
    if (task.service) {
      if (Object.keys(CoreServices).indexOf(task.service) !== -1) {
        throw new Error('Cannot assign a task to the Core Service');
      }
    }
  }

  private async ensureNoSircular(task: Task) {
    if (task.parentTask && task._id) {
      const currentId = task._id;
      const allTasks = await TaskSchema.find();
      const tasksMap: Map<string, Task> = new Map();
      for (const task of allTasks) {
        tasksMap.set(task._id.toString(), task);
      }
      let loopTaskId = task.parentTask;
      const usedIds: string[] = [];
      while (loopTaskId && loopTaskId !== currentId && usedIds.indexOf(loopTaskId) === -1) {
        usedIds.push(loopTaskId);
        const temp = tasksMap.get(loopTaskId);
        loopTaskId = temp && temp.parentTask && temp.parentTask.toString();
      }
      if (loopTaskId) {
        throw new Error('Cannot save circular referencing tasks');
      }
    }
  }


  async findByOrg(organizationId: string, params: any = {}, userId: string = '', type: string, algorithmic: boolean = false, projects?: any): Promise<Task[]> {
    const projectList = projects.map((project: any) => project._id);
    const { service } = params;
    let query: any = {};
    const sort = {} as any;
    if (algorithmic) {
      sort['algorithmic.demand'] = -1;
    }
    sort.createdAt = -1;
    query = {
      $or: [
        {
          organization: organizationId,
          service: { $ne: 'PROJECT_MANAGER' },
          type: type,
          read: false,
          notifyDate: { $lte: new Date() }
        },
        {
          organization: organizationId,
          project: { $in: projectList },
          service: 'PROJECT_MANAGER',
          type: type,
          dismissed: {$nin: userId},
          state: {$nin: ['DONE', 'BACKLOG']}
        }
      ]
    };
    if (userId) {
      query.$or[0].$or = [
        { 'assigned': { $size: 0 } },
        { 'assigned': { $in: [userId] } }
      ];
    }
    if (type === TaskType.NOTIFICATION) {
      query.$or[1] = {
        organization: organizationId,
        service: 'PROJECT_MANAGER',
        type: type,
        dismissed: {$nin: userId},
        assigned: {$in: userId}
      };
    }
    const tasks: any = await TaskSchema.find(query).sort(sort).lean();
    const populatedTasks = _.map(tasks, (task: Task) => {
      const project = _.find(projects, (proj: any) => proj._id == task.project);
      if (project && project._id) {
        task.project = project;
        return task;
      } else {
        return task;
      }
    });
    return populatedTasks;
  }

  async findByUser(userId: String, params: any = {}, isNotify: boolean = false, type: string, algorithmic: boolean = false): Promise<Task[]> {
    const sort = {} as any;
    if (algorithmic) {
      sort['algorithmic.demand'] = -1;
    }
     // tslint:disable-next-line: no-null-keyword
    return isNotify ? TaskSchema.find({ type: type, organization: { $eq: null }, read: false, assigned: { $in: [userId] }, notifyDate: { $lte: new Date() } }).populate('project', projectPopulateDefaults).sort(sort) :
      // tslint:disable-next-line: no-null-keyword
      TaskSchema.find({ createdBy: userId, organization: { $eq: null } }).populate('project', projectPopulateDefaults).sort(sort);
  }

  async create(task: Task): Promise<Task> {
    //  this.prepareTaskReferences(task);
    const taskSchema = new TaskSchema(task);
    return taskSchema.save();
  }

  async update(task: Task): Promise<Task> {
    //  this.prepareTaskReferences(task);
    await this.ensureNoSircular(task);
    return await TaskSchema.findByIdAndUpdate(task._id, task, { new: true });
  }

  async findById(taskId: string): Promise<Task> {
    return TaskSchema.findById(taskId).populate('assigned', 'name profile');
  }

  async remove(taskId: string, board: string = ''): Promise<Task> {
    if (board) {
      await TaskSchema.remove({ board: board, service: 'PROJECT_MANAGER' });
      return;
    } else {
      await TaskSchema.updateMany({ 'dependencies.task': new ObjectId(taskId) }, { $pull: { dependencies: { 'task': new ObjectId(taskId) } } }, { new: true });
      return TaskSchema.findByIdAndRemove(taskId);
    }
  }


  async removeByRefId(refId: string): Promise<any> {
    return TaskSchema.deleteMany({ 'action.referenceId': refId });
  }

  async removeByRefIds(refIds: string[], organization: string): Promise<any> {
    return TaskSchema.deleteMany({ 'action.referenceId': { $in: refIds }, organization });
  }

  async assignToMe(taskId: string, userId: string): Promise<any> {
    return TaskSchema.findByIdAndUpdate(taskId, { $push: { assigned: userId } }, { new: true });
  }

  // Update task by action data
  async updateByCondition(condition: any) {
    const result = await TaskSchema.findOneAndUpdate(condition, { $set: { 'action.data.status': 'DONE', 'state': 'DONE' } }, { new: true });
    return result;
  }

  async markAsRead(taskId: string, userId: string) {
    const result = await TaskSchema.findByIdAndUpdate(taskId, { $push: { dismissed: userId } }, { new: true });
    return result;
  }

  async markAsDone(taskId: string, userId: string) {
    const task = await TaskSchema.findById(taskId);
    const update: { $set: any, $push?: any } = { $set: { state: 'DONE' } };
    if (task.type !== 'TASK') {
      update['$push'] = { dismissed: userId };
    }
    const result = await TaskSchema.findByIdAndUpdate(taskId, update, { new: true });
    return result;
  }

  async markAsUnDone(taskIds: Array<string>, userId: string) {
    const result = await TaskSchema.updateMany({ _id: { $in: taskIds } }, { $pull: { dismissed: userId }, state: 'IN_PROGRESS' }, { multi: true });
    return result;
  }

  // Get all tasks by filter
  async findAllTasks(condition: any, skip: number, size: number = 10): Promise<any> {
    const totalCount = await TaskSchema.find(condition).countDocuments();
    const data = await TaskSchema.find(condition)
      .populate('dependencies.task')
      .skip(skip)
      .limit(size)
      .sort({ createdAt: -1 })
      .exec();
    return { data, totalCount };
  }
  // Get task by filter
  async getByFilter(condition: any) {
    const result = await TaskSchema.findOneAndUpdate(condition, { $set: { state: 'IN_PROGRESS' } }, { new: true })
      .populate('dependencies.task')
      .sort({ createdAt: 1 });
    return result;
  }

  async getStartedTask(organizationId: string, userId: string) {
    const result = await TaskSchema.findOne({
      organization: organizationId,
      assigned: { $in: [userId] },
      loggedTime: {
        $elemMatch: {
          // tslint:disable-next-line:no-null-keyword
          endTime: { $eq: null }
        }
      }
    });
    return result;
  }

  async findWorkload(organizationId: string, body: any) {
    const start = moment(new Date(decodeURIComponent(body.startDate))).startOf('day').toDate();
    const end = moment(new Date(decodeURIComponent(body.endDate))).endOf('day').toDate();
    const ids = body.employees.map((el: any) => mongoose.Types.ObjectId(el));
    const result = await TaskSchema.aggregate([
      {
        $match: {
          $and: [
            {
              'assigned': { $in: ids }
            },
            {
              'organization': new ObjectId(organizationId)
            },
            {
              'state': { $in: ['TO_DO', 'IN_PROGRESS', 'DONE'] }
            },
            {
              'createdAt': { '$gte': start, '$lte': end }
            }
          ]
        },
      },
      { $unwind: { path: '$assigned' } },
      { $match: { 'assigned': { $in: ids } } },
      {
        $lookup:
        {
          from: 'users',
          localField: 'assigned',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $group: {
          _id: {
            'assigned': '$assigned',
            'state': '$state'
          },
          count: { $sum: 1 },
          user: { $first: '$user' }
        }
      },
      {
        $group: {
          _id: {
            'assigned': '$_id.assigned',
          },
          user: { $first: '$user' },
          data: {
            $push: {
              'state': '$_id.state',
              'count': '$count'
            }
          },
        }
      },
      { $unwind: { path: '$user' } },
      {
        $project: {
          '_id': 0,
          'user._id': 1,
          'user.profile.lastName': 1,
          'user.profile.firstName': 1,
          'user.email': 1,
          'data': '$data',
        }
      }
    ]);
    return result;
  }

  async findEffectiveTime(organizationId: string, params: any) {
    const start = moment(new Date(decodeURIComponent(params.startDate))).startOf('day').toDate();
    const end = moment(new Date(decodeURIComponent(params.endDate))).endOf('day').toDate();
    const ids = params.ids;
    const result = await TaskSchema.aggregate([
      { $unwind: { path: '$loggedTime' } },
      {
        $match: {
          $and: [
            {
              'organization': mongoose.Types.ObjectId(organizationId)
            },
            {
              'loggedTime.startTime': {
                '$gte': start
              }
            },
            {
              'loggedTime.endTime': {
                '$lte': end
              }
            },
            {
              'loggedTime.user': { $in: ids }
            }
          ]
        },
      },
      { $unwind: { path: '$loggedTime' } },
      {
        $lookup:
        {
          from: 'users',
          localField: 'loggedTime.user',
          foreignField: '_id',
          as: 'user'
        }
      },
      {
        $group: {
          _id: '$loggedTime.user',
          user: { $first: '$user' },
          logger: {
            $push: {
              'startTime': '$loggedTime.startTime',
              'endTime': '$loggedTime.endTime'
            }
          }
        }
      },
      { $unwind: { path: '$user' } },
      {
        $project: {
          '_id': 0,
          'user._id': 1,
          'user.profile.firstName': 1,
          'user.profile.lastName': 1,
          'user.email': 1,
          'logger': 1
        }
      }
    ]);
    return result;
  }

  async removeMany(taskIds: Array<ObjectId>, assignToIds?: Array<string>) {
    // Delete parent, sub tasks and their notifications
    let condition: any = {
      $or: [
        { _id: { $in: taskIds } }, // Parent task
        { 'parentTask': { $in: taskIds } }, // Sub tasks
        { 'action.referenceId': { $in: taskIds }, 'type': TaskType.NOTIFICATION }, // Notifications
      ]
    };
    if (assignToIds.length) {
      condition = { 'action.referenceId': { $in: taskIds }, 'action.data.assignedTo': { $in: assignToIds }, 'type': TaskType.NOTIFICATION }; // Notifications for assigned users
    }
    await TaskSchema.deleteMany(condition);
    return;
  }

}
