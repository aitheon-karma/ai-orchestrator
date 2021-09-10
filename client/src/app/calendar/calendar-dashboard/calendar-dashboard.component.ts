import { Component, OnInit, ViewChild } from '@angular/core';
import { Task, RecurringSetting, TasksService, TaskType } from '../../tasks/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@aitheon/core-client';
import { ToastrService } from 'ngx-toastr';
import { Observable, of, concat } from 'rxjs';

import { Subject } from 'rxjs';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

export interface CalendarSettings {
  title: string;
  taskId: string;
  start: Date;
  end?: Date;
}

@Component({
  selector: 'ai-calendar-dashboard',
  templateUrl: './calendar-dashboard.component.html',
  styleUrls: ['./calendar-dashboard.component.scss']
})
export class CalendarDashboardComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, interactionPlugin];

  task: Task;
  isLoading = true;

  tasks: Task[];
  currentUser: any;
  modal: any;
  modalContent: any;
  refresh: Subject<any> = new Subject();
  events: any = [];
  activeDayIsOpen = true;


  viewDate: Date = new Date();


  constructor(
    private tasksService: TasksService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private authService: AuthService
  ) {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
    });
  }

  ngOnInit() {
    this.fetchEvents();
  }

  delete(task: Task) {
    const answer = confirm(`Remove task ${task.name}?`);
    if (!answer) {
      return;
    }
    this.tasksService.remove(task._id).subscribe((i) => {
      this.toastr.warning('Task has been deleted');
      this.fetchEvents();
    }, err => this.toastr.error('Could not delete the task'));
  }

  create() {
    this.router.navigateByUrl('/calendar/new');
  }

  eventClick(model: any) {
    this.router.navigate(['calendar', model.taskId]);
  }

  updateEvent(model: any) {
    let finishDate;
    if (model.event.end) {
      finishDate = new Date(model.event.end);
    } else {
      finishDate = false;
    }
    model = {
      event: {
        id: model.event.id,
        start: model.event.start,
        end: model.event.end,
        title: model.event.title
        // other params
      },
      task: {
        _id: model.event.extendedProps.taskId,
        title: model.event.title,
        startDate: new Date(model.event.start),
      }
    };

    if (finishDate) {
      model.task.finishDate = finishDate;
    } else {
      delete model.task.finishDate;
    }

    this.tasksService.update(model.task).subscribe(() => {
      this.fetchEvents();
    }, (err) => {
      console.log('error during update event');
    });
  }

  fetchEvents() {
    this.tasksService.list().subscribe((result) => {
      const res = result.filter((item) => item.addToCalendar);
      this.tasks = res;

      const events: CalendarSettings[] = res.map(event => {
        const temp: CalendarSettings = {
          title: event.name || '',
          start: event.startDate,
          taskId: event._id,
        };

        if (event.finishDate) {
          temp.end = event.finishDate;
        }
        return temp;
      });

      this.events = events;

      this.isLoading = false;
    });
  }

  formatDateUS(date: Date | string) {
    const dateAsObj = new Date(date);
    return dateAsObj.toLocaleDateString('en-US') + ' ' + dateAsObj.toLocaleTimeString('en-US');
  }

}
