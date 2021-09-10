import { Component, OnInit, Input, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { EmployeesRestService, TrackerRestService } from '@aitheon/hr';
import { AuthService } from '@aitheon/core-client';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { TasksRestService } from '@aitheon/orchestrator';
import * as _ from "lodash";

@Component({
  selector: 'ai-workload-hours-list',
  templateUrl: './workload-hours-list.component.html',
  styleUrls: ['./workload-hours-list.component.scss']
})
export class WorkloadHoursListComponent implements OnInit {

  @Input('selectedTab') selectedTab: string;
  // options
  view: any[] = [900, 120];
  yAxisLabel: string = 'Employees';

  xAxisLabel: string = 'Time (In minutes)';
  legendTitle = 'Time'
  colorScheme = {
    domain: ['#ed9438', '#67b231']
  };

  organizationId: string;
  filterType = 'Today';
  sortBy: string;
  sortOptions = ['Most effective time', 'Most overhead time'];
  data: any[] = [];
  multi: any = [];
  optionChoosed: any;
  loading: boolean = true;
  constructor(private authService: AuthService,
    private trackerRestService: TrackerRestService,
    private tasksRestService: TasksRestService,
    private toastr: ToastrService) {
  }
  ngOnInit() {
    let isActive = false;
    this.authService.activeOrganization.subscribe((org: any) => {
      if (!isActive) {
        this.organizationId = org._id;
        isActive = true;
        if (this.selectedTab == 'Hours') {
          this.getEmplooyeeTrackerByPeriod();
        }
      }
    });
  }
  ngOnChanges(changes: SimpleChanges) {
    if (this.selectedTab == 'Hours' && this.organizationId) {
      this.getEmplooyeeTrackerByPeriod();
    }
  }

  getEmplooyeeTrackerByPeriod() {
    this.loading = true;
    let startDate: any, endDate: any;
    // this.employeeTracker = [];
    this.data = [];
    const date = new Date();

    if (this.filterType == 'Month') {
      // filter by month
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    else if (this.filterType == 'Week') {
      // filter by week
      const first = date.getDate() - date.getDay();
      const last = first + 6;
      startDate = new Date(date.setDate(first));
      endDate = new Date(date.setDate(last));
    }
    // filter by today
    else {
      startDate = new Date();
      endDate = new Date();
    }
    this.trackerRestService.defaultHeaders = this.trackerRestService.defaultHeaders.set('organization-id', this.organizationId);
    this.getEffectiveTime(startDate, endDate);
  }

  changeFilter(filter: string) {
    this.optionChoosed = undefined;
    this.filterType = filter;
    this.getEmplooyeeTrackerByPeriod();
  }

  getEffectiveTime(startDate, endDate) {
    this.tasksRestService.getEffectiveTime(this.organizationId, startDate.toDateString(), endDate.toDateString()).subscribe((data: any) => {
      this.setChartData(data);
    }, (err) => {
      this.loading = false;
      this.toastr.error(err.message || err);
    })
  }
  getSum(x, time) {
    let startTime = moment(new Date(time.startTime));
    let endTime = moment(new Date(time.endTime))
    let duration = moment.duration(endTime.diff(startTime));
    let minutes = Math.ceil(duration.asMinutes());
    return x + minutes;
  }


  setChartData(data) {
    this.multi = [];
    if (data.overheadTime.length > 0) {
      data.overheadTime.forEach((element: any) => {
        let data: any = {
          'name': `${element.employee.inviteInfo.firstName} ${element.employee.inviteInfo.lastName}`,
          'user': element.employee.user,
          'series': []
        }
        let duration = element.trackers.reduce(this.getSum, 0)
        data.series[0] = {
          'name': 'Overhead time',
          'value': duration
        }
        data.series[1] = {
          'name': 'Effective time',
          'value': 0
        }
        this.multi.push(data);
      });
    }
    if (data.effectiveTime.length > 0) {
      data.effectiveTime.forEach((user: any) => {
        let duration = user.logger.reduce(this.getSum, 0);
        let index = _.findIndex(this.multi, { 'user': user.user._id });
        if (index != -1) {
          this.multi[index].series[1].value = duration;
        }
        else {
          this.multi.push({
            'name': `${user.user.profile.firstName}  ${user.user.profile.lastName}`,
            'series': [
              {
                'name': 'Overhead time',
                'value': 0
              },
              {
                'name': 'Effective time',
                'value': duration
              }
            ]
          })
        }
      })
    }
    if(this.multi.length > 1){
      this.view = [900, 80 * this.multi.length]
    }
    this.sortOnCount();
  }

  sortOnCount() {
    if (this.optionChoosed) {
      switch (this.optionChoosed) {
        case 'Most effective time':
          this.multi.sort((a, b) => {
            return b.series[0].value - a.series[0].value
          });
          break;
        case 'Most overhead time':
          this.multi.sort((a, b) => {
            return b.series[1].value - a.series[1].value
          });
          break;
      }
    }
    this.loading = false;
  }

  onChange(event) {
    this.getEmplooyeeTrackerByPeriod();
  }
  onSelect(event) {
  }
}
