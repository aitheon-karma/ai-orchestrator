import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, TasksService } from './../shared';


@Component({
  selector: 'ai-task-detail',
  templateUrl: './task-detail.component.html',
  styleUrls: ['./task-detail.component.scss']
})
export class TaskDetailComponent implements OnInit {
  task: Task;

  isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private tasksService: TasksService,
  ) { }

  ngOnInit() {
    this.route.params.subscribe((params: { [key: string]: any }) => {
      const taskId: string = params.taskId;
      const parentTask = params['parentTask'];

      if (taskId === 'new' || parentTask) {
        this.task = new Task();
        // this.task.parent = parentTask;
        this.buildForm(this.task);
      } else {
        this.isLoading = true;
        this.tasksService.get(taskId).subscribe((task: Task) => {
          this.task = task;
          this.isLoading = false;
          this.buildForm(this.task);
        }, (err) => {
          this.router.navigateByUrl('/');
        });
      }
    });
  }

  buildForm(task: Task) {

  }

}
