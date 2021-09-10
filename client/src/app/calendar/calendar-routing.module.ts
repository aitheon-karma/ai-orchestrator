import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarFullComponent } from './calendar-full/calendar-full.component';
import { CalendarDashboardComponent } from './calendar-dashboard/calendar-dashboard.component';
import { CalendarFormComponent } from './calendar-form/calendar-form.component';
import { CalendarWidgetComponent } from './calendar-widget/calendar-widget.component';

const routes: Routes = [
  { path: 'calendar/full', component: CalendarFullComponent },
  { path: 'calendar', component: CalendarDashboardComponent },
  { path: 'calendar/:id', component: CalendarFormComponent },
  { path: 'calendar/widget', component: CalendarWidgetComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CalendarRoutingModule { }
