import { Component, OnInit, Input, SimpleChange, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TasksRestService } from '@aitheon/orchestrator';
import * as _ from "lodash";
import { map, every } from 'rxjs/operators'
@Component({
  selector: 'ai-workload-task-list',
  templateUrl: './workload-task-list.component.html',
  styleUrls: ['./workload-task-list.component.scss']
})
export class WorkloadTaskListComponent implements OnInit {

  @Input('employees') employees: any;
  @Input('selectedTab') selectedTab: string;

  filterType = 'Today';
  workloadData: any;
  sortBy: string;
  data = [{ state: "TO_DO", count: 0 }, { state: "IN_PROGRESS", count: 0 }, { state: "DONE", count: 0 }]
  sortOptions = ['Most To Do', 'Most In Progress', 'Most Done'];
  optionChoosed: string;
  multi: any = [];

  // options
  legendTitle = "State";
  yAxisLabel: string = 'Employees';
  xAxisLabel: string = 'Task';
  colorScheme = {
    'domain': ['#ed9438', '#589be9', '#67b231']
  };
  view =[900, 120]

  loading: boolean;

  constructor(private taskRestService: TasksRestService, private toastr: ToastrService) {
  }
  onSelect(event) {
  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if ((changes.employees && changes.employees.currentValue) || (changes.selectedTab.currentValue == 'Tasks' && this.employees.length > 0)) {
      this.getChartData();
    }
  }
  changeFilter(filter: string) {
    this.optionChoosed = undefined;
    this.filterType = filter;
    this.getChartData();
  }

  getChartData() {
    this.loading = true;
    let startDate: any, endDate: any;
    const date = new Date();
    // filter by month
    if (this.filterType == 'Month') {
      startDate = new Date(date.getFullYear(), date.getMonth(), 1);
      endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }
    // filter by week
    else if (this.filterType == 'Week') {
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
    let employeeIds = this.employees.map((e) => e.user._id);
    const data: any = {
      'startDate': startDate.toDateString(),
      'endDate': endDate.toDateString(),
      'filterType': this.filterType,
      'employees': employeeIds
    };
    this.taskRestService.getWorkloadTasks(data).subscribe((res: any) => {
      this.workloadData = res;
      this.setChart(this.workloadData);
    }, (error: any) => {
      this.loading = false;
      this.toastr.error(error.message);
    })
  }

  setChart(chartData: any) {
    this.multi = [];
    chartData.forEach((element: any, index) => {
      element.data = _.unionBy(element.data, this.data, 'state');
      element.data = _.orderBy(element.data, ['state'], ['desc']);
      let workload: any = {
        'name': `${element.user.profile.firstName} ${element.user.profile.lastName}`,
        'series': []
      };
      element.data.forEach((obj: any) => {
        workload.series.push({
          'name': obj.state,
          'value': obj.count
        });
      });
      this.multi.push(workload);
    });
    
    if(this.multi.length > 1){
      this.view = [900, 80* this.multi.length];
    }
    this.sortOnCount();
  }

  sortOnCount() {
    if (this.optionChoosed) {
      switch (this.optionChoosed) {
        case 'Most To Do':
          this.multi.sort((a, b) => {
            return b.series[0].value - a.series[0].value
          });
          break;
        case 'Most In Progress':
          this.multi.sort((a, b) => {
            return b.series[1].value - a.series[1].value
          });
          break;
        case 'Most Done':
          this.multi.sort((a, b) => {
            return b.series[2].value - a.series[2].value
          });
          break;
      }
    }
    this.loading = false;
  }
  onChange(event) {
    this.getChartData();
  }

}
