import { Component, OnInit } from '@angular/core';
import { GanttService } from '../shared/gantt.service';

@Component({
  selector: 'ai-gantt-view',
  templateUrl: './gantt-view.component.html',
  styleUrls: ['./gantt-view.component.scss']
})
export class GanttViewComponent implements OnInit {

  constructor(public ganttService: GanttService) { }

  ngOnInit() {
  }

}
