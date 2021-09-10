import { Component, OnInit } from '@angular/core';
import { GanttService } from '../shared/gantt.service';

@Component({
  selector: 'ai-gantt-calendar-view',
  templateUrl: './gantt-calendar-view.component.html',
  styleUrls: ['./gantt-calendar-view.component.scss']
})
export class GanttCalendarViewComponent implements OnInit {
  constructor(public ganttService: GanttService) { }

  ngOnInit() { }

}
