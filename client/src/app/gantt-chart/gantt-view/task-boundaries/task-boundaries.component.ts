import { Component, OnInit, Input } from '@angular/core';
import { GanttService } from '../../shared/gantt.service';
import { Task, TasksService } from '../../../tasks/shared';

@Component({
  selector: '[aiTaskBoundaries]',
  templateUrl: './task-boundaries.component.html',
  styleUrls: ['./task-boundaries.component.scss']
})
export class TaskBoundariesComponent implements OnInit {
  @Input() task: Task;
  @Input() index: number;

  constructor(
    private tasksService: TasksService,
    public ganttService: GanttService
  ) { }

  editTask() {
    this.tasksService.openTasksModal({
      new: false,
      id: this.task._id,
    });
  }

  ngOnInit() {
  }

}
