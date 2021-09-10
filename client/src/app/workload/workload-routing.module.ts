import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WorkloadDashboardComponent } from './workload-dashboard/workload-dashboard.component';
const routes: Routes = [
  {
    path: '', component: WorkloadDashboardComponent
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WorkloadRoutingModule { }
