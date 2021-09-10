import { Component, OnInit } from '@angular/core';
import { GanttService } from '../../shared/gantt.service';

@Component({
  selector: '[aiDayBoundaries]',
  templateUrl: './day-boundaries.component.html',
  styleUrls: ['./day-boundaries.component.scss']
})
export class DayBoundariesComponent implements OnInit {

  constructor(public ganttService: GanttService) { }

  ngOnInit() {
  }

}
