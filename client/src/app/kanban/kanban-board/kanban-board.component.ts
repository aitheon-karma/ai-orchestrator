import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, TasksService, TaskState } from '../../tasks/shared';
import { ToastrService } from 'ngx-toastr';
import { DropEvent } from 'ng-drag-drop';
import { AuthService } from '@aitheon/core-client';
import { SalesService } from 'src/app/shared/sales/sales.service';
import { TasksRestService } from '@aitheon/orchestrator';

@Component({
  selector: 'ai-kanban-board',
  templateUrl: './kanban-board.component.html',
  styleUrls: ['./kanban-board.component.scss']
})
export class KanbanBoardComponent implements OnInit, OnDestroy {
  private refresh$: any;
  private activeOrganization$: any;
  public baseTasks: Task[];

  modernStyle = true;
  loading: boolean = true;
  taskStates: string[] = Object.keys(TaskState);
  defaultState = this.taskStates[0];
  taskGroups: { [key: string]: Task[] } = {};
  taskList: any = [];
  pageNo: number = 1;
  searchText: any = ''
  searchState: any = '';
  totalPages: number;
  optionFlag: Boolean = false;
  pageNumberList: any = [];
  options: any[];
  selectedPage: number;
  recordPerPage: number = 15;
  currentPage: number;


  constructor(
    private authService: AuthService,
    private toastr: ToastrService,
    private tasksService: TasksService,
    private tasksRestService: TasksRestService,
    private saleService: SalesService
  ) { }

  private placeTasks(tasks: Task[] = []) {
    this.taskList = tasks;
    const taskMap = new Map<string, Task>();
    const baseTaskMap = new Map<string, Task>();
    this.taskStates.forEach((state: string) => this.taskGroups[state] = []);
    for (const task of tasks) {
      task.subTasks = [];
      if (!TaskState[task.state]) {
        task.state = this.defaultState;
      }
      taskMap.set(task._id, task);
    }

    for (const task of tasks) {
      if (typeof task.parentTask === 'string') {
        const parent = taskMap.get(task.parentTask);
        if (!parent) {
          task.parentTask = null;
          baseTaskMap.set(task._id, task);
          continue;
        }
        parent.subTasks.push(task);
        if (typeof parent.parentTask === 'string') {
          baseTaskMap.set(parent._id, parent);
        }
      } else {
        baseTaskMap.set(task._id, task);
      }
      this.taskGroups[task.state].push(task);
      this.baseTasks = Array.from(baseTaskMap.values());
    }
  }

  private prepareTaskForSaving(task: Task) {
    return {
      ...task,
      parentTask: task.parentTask instanceof Task ? task.parentTask._id : task.parentTask,
      subTasks: undefined
    };
  }

  loadTasks(pageNo, silent = false) {
    if (!silent) {
      this.loading = true;
    }
    // this.tasksService.list().subscribe((tasks: Task[] = []) => {
    //   this.placeTasks(tasks);
    //   this.loading = false;
    // }, (err: any) => {
    //   this.toastr.error(err);
    //   this.loading = false;
    // });
    this.recordPerPage = Number(localStorage.getItem('recordPerPage')) ? Number(localStorage.getItem('recordPerPage')) : 15;
    this.tasksRestService.taskList(null, null, pageNo, this.searchText, this.searchState, this.recordPerPage).subscribe((tasks: any) => {
      this.placeTasks(tasks.data);
      this.totalPages = Math.ceil(tasks.totalCount / (this.recordPerPage ? this.recordPerPage : 15));
      this.totalPages = isNaN(this.totalPages) ? 0 : this.totalPages;
      for (let i = 1; i <= this.totalPages; i++) {
        this.options.push(i);
      }
      this.optionFlag = true;
      this.paginationLogic(pageNo);
      this.loading = false;
    }, (err: any) => {
      this.toastr.error(err);
      this.loading = false;
    });
  }

  editTask(item: Task) {
    this.tasksService.openTasksModal({
      new: false,
      id: item._id,
    });
  }

  getSortedTaskIndexes(task: Task) {
    const states: string[] = [task.state];
    for (const subtask of task.subTasks) {
      states.push(subtask.state);
    }

    const indexes = states.map((state: string) => this.taskStates.indexOf(state));
    indexes.sort();
    return indexes;
  }

  getParentTaskStyle(task: Task) {
    const indexes = this.getSortedTaskIndexes(task);
    const span = indexes[indexes.length - 1] - indexes[0] + 1;
    const columnIndex = indexes[0] + 1;
    return { 'z-index': '1', 'grid-column-end': `span ${span}`, 'grid-column-start': columnIndex };
  }

  moveTask(event: DropEvent, state: string) {
    const currentTask = event.dragData;
    const oldState = currentTask.state;
    if (oldState === state) {
      return;
    }
    const index = this.taskGroups[oldState].findIndex((task: Task) => task === currentTask);
    currentTask.state = state;
    this.taskGroups[oldState].splice(index, 1);
    this.taskGroups[state].push(currentTask);
    this.tasksService.update(this.prepareTaskForSaving(currentTask)).subscribe(
      (response: any) => {
        const data: any = { DealUpdateType: 'UPDATE_STATUS' };
        if (response.state == 'DONE') {
          data['status'] = 'WON';
        } else if (response.state == 'PENDING' || response.state == 'IN_PROGRESS') {
          data['status'] = 'OPEN';
        }
        this.saleService.updateDealStatus(response.data, data).subscribe((deal) => {
        }, (error) => {
          this.toastr.error('Could not update status of deal in sales');
        });
      },
      error => {
        this.loadTasks(this.currentPage, true);
        this.toastr.error('Could not save the task');
      });
  }

  addSubtask(task: Task) {
    this.tasksService.openTasksModal({
      new: true,
      parent: task._id,
    });
  }

  ngOnInit() {
    this.pageNumberList = [];
    this.options = [];
    if (localStorage.getItem('currentPage') === null || localStorage.getItem('currentPage') === undefined) {
      this.currentPage = 1;
    } else {
      this.currentPage = Number(localStorage.getItem('currentPage'));
    }
    this.refresh$ = this.tasksService.refresh.subscribe((isSaved: boolean) => {
      this.loadTasks(1, true);
    });
    this.activeOrganization$ = this.authService.activeOrganization.subscribe((organization: any) => {
      this.loadTasks(1);
    });
  }

  ngOnDestroy() {
    this.refresh$.unsubscribe();
    this.activeOrganization$.unsubscribe();
    localStorage.removeItem('currentPage');
    localStorage.removeItem('recordPerPage');
  }
  setPage(pageNo) {
    pageNo = Number(pageNo);
    this.optionFlag = false;
    this.currentPage = pageNo;
    this.selectedPage = pageNo;
    this.paginationLogic(pageNo);
    this.loadTasks(pageNo);
    this.optionFlag = true;
  }

  paginationLogic(pageNo) {
    // pagination logic start
    this.pageNumberList = [];
    for (let i = 1; i <= this.totalPages; i++) {
      if (i >= (pageNo - 2) && i <= (pageNo + 1)) {
        this.pageNumberList.push(i);
      } else if (i != this.totalPages && i >= (pageNo + 1)) {
        this.pageNumberList.push(-1);
      } else if (i == this.totalPages) {
        this.pageNumberList.push(i);
      }
    }
    this.pageNumberList = this.pageNumberList.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    });
    // pagination logic end
  }

  //setting the record count on dropdown
  setRecordCount(recordCount) {
    localStorage.setItem('recordPerPage', recordCount.toString());
    localStorage.removeItem('currentPage');
    localStorage.setItem('currentPage', '1');
    this.currentPage = Number(localStorage.getItem('currentPage'));
    this.recordPerPage = Number(localStorage.getItem('recordPerPage'));
    this.loadTasks(this.currentPage);
  }

}
