import { Component, OnInit } from '@angular/core';
import { GanttService } from '../shared/gantt.service';
import { Task, TasksService } from '../../tasks/shared';

@Component({
  selector: 'ai-gantt-grid-body',
  templateUrl: './gantt-grid-body.component.html',
  styleUrls: ['./gantt-grid-body.component.scss']
})
export class GanttGridBodyComponent implements OnInit {

  constructor(
    private tasksService: TasksService,
    public ganttService: GanttService
  ) { }

  toggleExpanded(task: Task, forceHide = false) {
    if (forceHide) {
      task.expanded = false;
    } else {
      task.expanded = !task.expanded;
    }
    if (!task.expanded && task.subTasks.length) {
      for (const subTask of task.subTasks) {
        this.toggleExpanded(subTask, true);
      }
    }
    this.ganttService.setDisplayedTasks();
  }

  editTask(taskId: string) {
    this.tasksService.openTasksModal({
      new: false,
      id: taskId,
    });
  }

  ngOnInit() {
  }

}
