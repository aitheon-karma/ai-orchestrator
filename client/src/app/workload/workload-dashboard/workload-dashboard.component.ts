import { Component, OnInit } from '@angular/core';
import { EmployeesRestService } from '@aitheon/hr';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@aitheon/core-client';
@Component({
  selector: 'ai-workload-dashboard',
  templateUrl: './workload-dashboard.component.html',
  styleUrls: ['./workload-dashboard.component.scss']
})
export class WorkloadDashboardComponent implements OnInit {

  organizationId: string;
  employeesList: any;
  selectedTab: string = 'Hours';
  constructor(private authService: AuthService, private employeesRestService: EmployeesRestService, private toastr: ToastrService) {
  }
  ngOnInit() {
    let isActive = false;
    this.authService.activeOrganization.subscribe((org: any) => {
      if (!isActive) {
        this.organizationId = org._id;
        isActive = true;
        this.getEmployeesList();
      }
    });
  }

  getEmployeesList() {
    this.employeesRestService.defaultHeaders = this.employeesRestService.defaultHeaders.set('organization-id', this.organizationId);
    this.employeesRestService.listAll(true).subscribe((res: any) => {
      this.employeesList = res;
    }, (error) => {
      this.toastr.error(error.message);
    });
  }

}
