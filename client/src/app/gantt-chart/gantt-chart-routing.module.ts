import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GanttChartDashboardComponent } from './gantt-chart-dashboard/gantt-chart-dashboard.component';
const routes: Routes = [
  {
    path: '',
    component: GanttChartDashboardComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GanttChartRoutingModule { }
