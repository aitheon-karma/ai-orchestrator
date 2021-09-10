import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, RecurringSetting, TasksService, TaskType, TaskState, ModalMeta } from './../shared';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subject } from 'rxjs';
import { AuthService } from '@aitheon/core-client';
import { CoreServices } from '../../shared/constants/core-services';
import { UsersService } from '../../shared/users';
import { of, concat } from 'rxjs';
import { catchError, map, switchMap, tap, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { User } from '../../shared/users';
import { TasksRestService } from '@aitheon/orchestrator';
import { GenericModalComponent } from '../../core/generic-modal/generic-modal.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ai-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
})
export class TaskFormComponent implements OnInit, OnDestroy {
  private activeOrganization$;
  private currentUser$;

  @Output('onSave') onSave: EventEmitter<Task> = new EventEmitter<Task>();
  @Output('onCancel') onCancel: EventEmitter<any> = new EventEmitter<any>();
  @Input() modalMeta: ModalMeta;
  @ViewChild('clockedInInfo') clockedInInfo: GenericModalComponent;

  tasks$: Observable<Task[]>;
  assigned$: Observable<User[]>;
  assignedInput$ = new Subject<string>();
  serviceId = 'ORCHESTRATOR';
  userId: string;
  task: Task;
  taskForm: FormGroup;
  services: {name: string}[] = [];
  organization: any;
  submitted = false;
  loading = false;
  taskTypes = Object.keys(TaskType).map((item: string) => ({name: item}));
  taskStates = Object.keys(TaskState).map((item: string) => ({name: item}));
  TaskType = TaskType;

  taskTime = 0;
  taskRunning = false;

  constructor(
    private toastr: ToastrService,
    private tasksService: TasksService,
    private tasksRestService: TasksRestService,
    private fb: FormBuilder,
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  private initTask() {
    if (this.modalMeta.id) {
      this.loading = true;
      this.tasksService.get(this.modalMeta.id).subscribe((task: Task) => {
        this.loading = false;
        this.task = task;
        this.formSetup();
      }, (err) => {
        this.loading = false;
        this.toastr.error('Could not load the task');
      });
    } else {
      this.task = new Task;
      this.task.assigned = [];
      if (this.modalMeta.parent) {
        this.task.parentTask = this.modalMeta.parent;
      }
      this.formSetup();
    }
  }

  private formSetup() {
    this.loadTasks();
    this.buildForm(this.task);
    this.setupTaskTime(this.task);
    if (this.organization) {
      this.loadassigned(this.task);
    }
  }

  private buildForm(task: Task) {
    this.taskForm = this.fb.group({
      name: [task.name, [Validators.required]],
      description: [task.description, [Validators.required]],
      type: [task.type || TaskType.TASK, [Validators.required]],
      state: [task.state || TaskState.PENDING, [Validators.required]],
      parentTask: [{value: task.parentTask, disabled: this.modalMeta.parent}, []],
      service: [task.service, []],
      assigned: [task.assigned.map((user: User) => user._id), []],
      files: [task.files, []],
    });
  }

  private loadassigned(task: Task) {
    this.assigned$ = concat(
      of(task.assigned),
      this.assignedInput$.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        tap(() => this.loading = true),
        switchMap(search => this.usersService.search({search}).pipe(
          map((results: any) => results.map((user: any) => ({...user, name: `${user.profile.firstName} ${user.profile.lastName}`}))),
          catchError(() => of([])),
          tap(() => this.loading = false)
        ))
      )
    );
  }

  private setupTaskTime(task: Task) {
    if (!task._id) {
      return;
    }

    let prevTime;
    let started;

    for (const time of task.loggedTime) {
      if (time.user === this.userId) {
        if (!time.endTime) {
          started = time;
          break;
        } else {
          prevTime = time;
        }
      }
    }

    if (!prevTime) {
      prevTime = {
        totalTime: 0
      };
    }

    if (started) {
      this.taskRunning = true;
      const startTime = new Date(started.startTime).getTime();
      this.taskTime = Math.floor((Date.now() - startTime) / 1000) + prevTime.totalTime;
    } else {
      this.taskRunning = false;
      this.taskTime = prevTime.totalTime;
    }
  }

  redirectToClockIn() {
    window.open(`${environment.baseApi}/hr/tracker`);
    // window.open(`http://localhost:4000/tracker`);
  }

  async toggleTask() {
    const performClockCheck = this.services.find((service) => service.name === 'HR');
    if (performClockCheck) {
      const isClockedIn = await this.tasksService.isClockedIn();
      if (!isClockedIn) {
        return this.clockedInInfo.show({text: `You are not clocked in.\nDo you want to clock in now?`, payload: {}});
      }
    }
    try {
      let task;
      if ( this.taskRunning ) {
        task = await this.tasksRestService.stop(this.task._id).toPromise();
      } else {
        task = await this.tasksRestService.start(this.task._id).toPromise();
      }
      this.task = task;
      this.formSetup();
    } catch(err) {
      this.toastr.error(err.error.error);
    }
  }

  cancelTask() {
    if (this.loading) {
      return;
    }
    this.onCancel.emit(null);
  }

  saveTask() {
    this.submitted = true;
    if (this.taskForm.invalid || this.loading) {
      return;
    }

    if (this.organization) {
      this.task.organization = this.organization._id;
    }

    const isCreating = !this.task._id;
    const mergedTask = {...this.task, ...this.taskForm.value};
    this.loading = true;
    this.tasksService[isCreating ? 'create' : 'update'](mergedTask).subscribe((t: Task) => {
      this.submitted = false;
      this.loading = false;
      this.toastr.success(`${isCreating ? 'Created' : 'Updated'} task ${mergedTask.name}`);
      this.onSave.emit(t);
    }, (err) => {
      this.submitted = false;
      this.loading = false;
      this.toastr.error('Could not save the task');
    });
  }

  loadTasks() {
    this.tasks$ = this.tasksService.list({parentsForId: this.task._id});
  }

  setServices(services: any[] = []) {
    this.services = services.filter((name: string) => !CoreServices[name]).map((name: string) => ({name}));
  }

  ngOnInit() {
    this.activeOrganization$ = this.authService.activeOrganization.subscribe((organization: any) => {
      this.organization = organization;
      this.currentUser$ = this.authService.currentUser.subscribe((user: any) => {
        this.userId = user._id;
        this.initTask();
        if (organization) {
          this.setServices(organization.services);
        } else {
          this.setServices(user.services);
        }
      });
    });
  }

  ngOnDestroy() {
    this.activeOrganization$.unsubscribe();
    this.currentUser$.unsubscribe();
  }
}


