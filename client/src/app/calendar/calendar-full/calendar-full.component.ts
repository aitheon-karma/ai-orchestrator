import { Component, OnInit } from '@angular/core';
import { Task, RecurringSetting, TasksService, TaskType } from '../../tasks/shared';

@Component({
  selector: 'ai-calendar-full',
  templateUrl: './calendar-full.component.html',
  styleUrls: ['./calendar-full.component.scss']
})
export class CalendarFullComponent implements OnInit {

  constructor(
    private tasksService: TasksService
  ) { }

  ngOnInit() {
  }

}
