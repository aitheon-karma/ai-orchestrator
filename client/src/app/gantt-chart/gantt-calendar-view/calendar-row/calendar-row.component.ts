import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'ai-calendar-row',
  templateUrl: './calendar-row.component.html',
  styleUrls: ['./calendar-row.component.scss']
})
export class CalendarRowComponent implements OnInit {
  @Input() items: string[];
  @Input() width: number;
  @Input() proportionsMap?: any;

  constructor() { }

  ngOnInit() {
  }

}
