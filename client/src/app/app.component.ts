import { Component, OnInit } from '@angular/core';
import { AuthService } from '@aitheon/core-client';
import { ActivatedRoute, Router } from '@angular/router';
import { Task, RecurringSetting, TasksService, TaskType } from './tasks/shared';

@Component({
  selector: 'ai-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  currentUser: any;
  navOpened = false;

  links = [
    { route: '/dashboard', name: 'Dashboard' },
    // { route: '/gantt-chart', name: 'Gantt Chart' },
    // { route: '/calendar', name: 'Calendar' },
    { route: '/workload', name: 'Workload' },
    // { route: '/recurring-tasks', name: 'Recurring Tasks' }
  ];

  constructor(
    private tasksService: TasksService,
    private router: Router,
    public authService: AuthService,
  ) {
    this.authService.currentUser.subscribe((user: any) => {
      this.currentUser = user;
      if (!this.currentUser.sysadmin) {
        return window.location.href = '/users/dashboard';
      }
    });
  }

  createTask() {
    this.tasksService.openTasksModal({
      new: true,
    });
  }

  ngOnInit() {
    this.authService.loggedIn.subscribe((loggedIn: boolean) => {
      console.log('loggedIn ', loggedIn);
    });
  }

  toggleMenu() {
    this.navOpened = !this.navOpened;
  }

}
