import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GanttChartRoutingModule } from './gantt-chart-routing.module';
import { GanttChartDashboardComponent } from './gantt-chart-dashboard/gantt-chart-dashboard.component';
import { GanttViewComponent } from './gantt-view/gantt-view.component';
import { GanttCalendarViewComponent } from './gantt-calendar-view/gantt-calendar-view.component';
import { CalendarRowComponent } from './gantt-calendar-view/calendar-row/calendar-row.component';
import { GanttGridHeaderComponent } from './gantt-grid-header/gantt-grid-header.component';
import { GanttGridBodyComponent } from './gantt-grid-body/gantt-grid-body.component';
import { DayBoundariesComponent } from './gantt-view/day-boundaries/day-boundaries.component';
import { ExpandButtonComponent } from './shared/components/expand-button/expand-button.component';
import { TaskBoundariesComponent } from './gantt-view/task-boundaries/task-boundaries.component';

@NgModule({
  declarations: [
    GanttChartDashboardComponent,
    GanttViewComponent,
    GanttCalendarViewComponent,
    CalendarRowComponent,
    GanttGridHeaderComponent,
    GanttGridBodyComponent,
    DayBoundariesComponent,
    ExpandButtonComponent,
    TaskBoundariesComponent,
  ],
  imports: [
    CommonModule,
    GanttChartRoutingModule
  ]
})
export class GanttChartModule { }
