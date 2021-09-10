import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ContextMenuModule } from 'ngx-contextmenu';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CalendarRoutingModule } from './calendar-routing.module';
import { CalendarFullComponent } from './calendar-full/calendar-full.component';
import { CalendarSmallComponent } from './calendar-small/calendar-small.component';
import { CalendarWidgetComponent } from './calendar-widget/calendar-widget.component';
import { CalendarDashboardComponent } from './calendar-dashboard/calendar-dashboard.component';
import { CalendarFormComponent } from './calendar-form/calendar-form.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { FullCalendarModule } from '@fullcalendar/angular';
import { CoreClientModule } from '@aitheon/core-client';


@NgModule({
  declarations: [CalendarFullComponent, CalendarSmallComponent, CalendarWidgetComponent, CalendarDashboardComponent, CalendarFormComponent],
  imports: [
    CommonModule,
    CoreClientModule,
    CalendarRoutingModule,
    ReactiveFormsModule,
    TimepickerModule,
    BsDatepickerModule,
    CollapseModule,
    ContextMenuModule,
    PopoverModule,
    TooltipModule,
    FormsModule,
    FullCalendarModule
  ]
})
export class CalendarModule { }
