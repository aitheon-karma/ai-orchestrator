import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CoreClientModule } from '@aitheon/core-client';
import { SharedModule } from '../shared/shared.module';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { TasksModule } from '../tasks/tasks.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { KanbanModule } from '../kanban/kanban.module';

@NgModule({
  imports: [
    CoreClientModule,
    SharedModule,
    DashboardRoutingModule,
    TasksModule,
    KanbanModule,
    AccordionModule.forRoot(),
    BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
  ],
  declarations: [DashboardComponent],
})
export class DashboardModule {

}
