import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreClientModule } from '@aitheon/core-client';
import { TabsModule } from 'ngx-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { WorkloadRoutingModule } from './workload-routing.module';
import { WorkloadDashboardComponent } from './workload-dashboard/workload-dashboard.component';
import { WorkloadHoursListComponent } from './workload-hours-list/workload-hours-list.component';
import { WorkloadTaskListComponent } from './workload-task-list/workload-task-list.component';

@NgModule({
  declarations: [WorkloadDashboardComponent, WorkloadHoursListComponent, WorkloadTaskListComponent],
  imports: [
    CommonModule,
    CoreClientModule,
    TabsModule,
    NgxChartsModule,
    WorkloadRoutingModule
  ]
})
export class WorkloadModule { }
