import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { TasksService } from '../../tasks/shared/tasks.service';
import { Task } from '../../tasks/shared/task';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class GanttService {
  dayWidth = 120;
  daysOnGrid = 45;
  lineHeight = 35;
  dayOffset = 6;
  loading = false;

  months = [];
  days = [];
  holidays = [];
  hours = [];
  monthMap: any;
  allTasks: Task[] = [];
  tasks: Task[] = [];
  headerSettings: any[] = [];
  taskMap = new Map<string, Task>();
  groupedTasks: Task[] = [];
  displayedTasks: Task[] = [];

  constructor(private tasksService: TasksService, private toastr: ToastrService) {
    this.initCalendar();
  }

  private initCalendar() {
    const firstDay = moment().subtract(this.dayOffset, 'd');
    const monthMap = {};
    const hours = ['00', '04', '08', '12', '16', '20'];

    for (let i = 0; i < this.daysOnGrid; i++) {
      const d = firstDay.clone().add(i, 'd');
      const month = moment.months(d.month());
      const year = d.year();
      const day = moment.weekdays(d.weekday());
      const date = d.date();
      const monthYear = `${month} ${year}`;

      if (monthMap[monthYear]) {
        monthMap[monthYear]++;
      } else {
        this.months.push(monthYear);
        monthMap[monthYear] = 1;
      }

      this.hours = [...this.hours, ...hours];
      this.days.push(`${date} ${day}`);
      if (d.weekday() === 0 || d.weekday() === 6) {
        this.holidays.push(`${date} ${day}`);
      }
    }

    this.months.forEach((item: string) => monthMap[item] = monthMap[item] / this.daysOnGrid);
    this.monthMap = monthMap;
  }

  private groupTasks(tasks: Task[], depth: number): Task[] {
    let expandedTasks = [];
    for (const task of tasks) {
      task.depth = depth;
      expandedTasks.push(task);
      if (task.subTasks.length) {
        expandedTasks = [...expandedTasks, ...this.groupTasks(task.subTasks, depth + 1)];
      }
    }
    return expandedTasks;
  }

  private placeTasks(tasks: Task[] = [], gracefulReload = false) {
    const oldTaskMap = this.taskMap;
    this.taskMap = new Map<string, Task>();
    for (const task of tasks) {
      task.subTasks = [];
      if (gracefulReload) {
        const existingTask = oldTaskMap.get(task._id);
        if (existingTask) {
          task.expanded = existingTask.expanded;
        }
      }
      this.taskMap.set(task._id, task);
    }

    for (const task of tasks) {
      if (task.parentTask) {
        const parent = this.taskMap.get(task.parentTask);
        if (!parent) {
          task.parentTask = null;
          continue;
        }
        parent.subTasks.push(task);
      }
    }
    return Array.from(this.taskMap.values()).filter((task: Task) => !task.parentTask);
  }

  private isParentExpanded(parentTaskId: string) {
    const parent = this.taskMap.get(parentTaskId);
    return !parent || parent.expanded;
  }

  setDisplayedTasks() {
    const temp = [];
    for (const task of this.groupedTasks) {
      if (this.isParentExpanded(task.parentTask)) {
        temp.push(task);
      }
    }
    this.displayedTasks = temp;
  }

  loadTasks(gracefulReload = false) {
    this.loading = true;
    this.tasksService.list().subscribe((tasks: Task[]) => {
      this.allTasks = tasks;
      this.tasks = this.placeTasks(tasks, gracefulReload);
      this.groupedTasks = this.groupTasks(this.tasks, 0);
      this.setDisplayedTasks();
      this.loading = false;
    }, (err: any) => {
      this.toastr.error('Could not load tasks');
      this.loading = false;
    });
  }
}
