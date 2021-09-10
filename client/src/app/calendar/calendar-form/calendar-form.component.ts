import { Component, OnInit } from '@angular/core';
import { Task, RecurringSetting, TasksService, TaskType } from '../../tasks/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@aitheon/core-client';

@Component({
  selector: 'ai-calendar-form',
  templateUrl: './calendar-form.component.html',
  styleUrls: ['./calendar-form.component.scss']
})
export class CalendarFormComponent implements OnInit {

  task: Task;

  error: any;
  currentUser: any;
  taskForm: FormGroup;
  submitted = false;

  newRecurringSetting: RecurringSetting;

  bsDaterangepicker: any;

  readonly = false;

  maxDate: Date = new Date();

  private composeTaskDraft(): Task {
    const task = new Task();
    const now = Date.now();
    task.name = '';
    task.description = '';
    task.startDate = new Date(now);
    // By default +1 hour
    task.finishDate = new Date(now + 3600000);
    return task;
  }

  constructor(
    private tasksService: TasksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private formBuilder: FormBuilder
  ) {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
   }

  ngOnInit() {
    const taskId = this.activatedRoute.snapshot.params['id'];
    if (taskId === 'new') {
      this.task = this.composeTaskDraft();
      this.buildForm(this.task);
    } else {
      this.tasksService.get(taskId).subscribe((task: Task) => {
        this.task = task;
        this.buildForm(task);
      });
    }
  }

  buildForm(task: Task) {
    this.taskForm = this.fb.group({
      name: [task.name, [Validators.required]],
      description: [task.description, [Validators.required]],
      startDate: [new Date(task.startDate), [Validators.required]],
      finishDate: [new Date(task.finishDate)],
      startTime: [new Date(task.startDate), [Validators.required]],
      finishTime: [new Date(task.finishDate)]
    });
  }

  delete() {
    const answer = confirm(`Remove task ${this.task.name}?`);
    if (!answer) {
      return;
    }
    this.tasksService.remove(this.task._id).subscribe((i) => {
      this.toastr.warning('Task has been deleted');
      this.router.navigateByUrl('/calendar');
    }, err => this.toastr.error('Could not delete the task'));
  }

  cancel() {
    this.taskForm = null;
    this.router.navigateByUrl('/calendar');
  }

  onSubmit() {
    this.submitted = true;
    if (this.taskForm.invalid) {
      return;
    }

    const taskForm = {...this.taskForm.value};
    taskForm.startDate.setHours(taskForm.startTime.getHours());
    taskForm.startDate.setMinutes(taskForm.startTime.getMinutes());
    taskForm.startDate.setSeconds(0);
    taskForm.finishDate.setHours(taskForm.finishTime.getHours());
    taskForm.finishDate.setMinutes(taskForm.finishTime.getMinutes());
    taskForm.finishDate.setSeconds(0);
    taskForm.addToCalendar = true;
    delete taskForm.startTime;
    delete taskForm.finishTime;

    if (taskForm.startDate >= taskForm.finishDate) {
      this.toastr.warning('Task end date must be after start date');
      return;
    }

    const task = {...this.task, ...taskForm};
    this.error = null;

    const isCreating = !task._id;

    this.tasksService[isCreating ? 'create' : 'update'](task).subscribe((t: Task) => {
      this.submitted = false;
      this.toastr.success(`${isCreating ? 'Created' : 'Updated'} task ${task.name}`);
      this.router.navigateByUrl('/calendar');
    }, (err) => {
      this.submitted = false;
      this.error = err;
    });
  }
}
