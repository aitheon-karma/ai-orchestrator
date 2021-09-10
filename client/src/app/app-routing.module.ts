import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'widget', redirectTo: '/widget', pathMatch: 'full' },
  { path: 'workload', loadChildren: './workload/workload.module#WorkloadModule' },
  { path: 'gantt-chart', loadChildren: './gantt-chart/gantt-chart.module#GanttChartModule' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
