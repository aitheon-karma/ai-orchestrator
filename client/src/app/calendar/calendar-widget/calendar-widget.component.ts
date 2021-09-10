import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ai-calendar-widget',
  templateUrl: './calendar-widget.component.html',
  styleUrls: ['./calendar-widget.component.scss']
})
export class CalendarWidgetComponent implements OnInit {
  collapsed: boolean;
  constructor() { }

  ngOnInit() {
  }

}
