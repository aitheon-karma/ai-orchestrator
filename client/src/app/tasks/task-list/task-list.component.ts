import { Component, OnInit, Input, TemplateRef, ViewChild } from '@angular/core';
import { Task, TasksService } from './../shared';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ContextMenuComponent } from 'ngx-contextmenu';
import { ContextMenuItemDirective } from 'ngx-contextmenu/lib/contextMenu.item.directive';
import { transformAll } from '@angular/compiler/src/render3/r3_ast';


@Component({
  selector: 'ai-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {
  @Input() tasks: any;
  @Input() taskCheckBoxList: boolean;

  @ViewChild(ContextMenuComponent) public basicMenu: ContextMenuComponent;


  taskform: Task;

  colorofState: any;

  modalTitle: string;
  modalTaskInput: {
    state: string,
    task: Task;
  };

  modalTaskDetailInput: {
    state: string,
    task: Task;
  };


  taskModalRef: BsModalRef;
  @ViewChild('taskModal') taskModal: TemplateRef<any>;


taskDetailsRef: BsModalRef;

@ViewChild('taskDetail') taskdetail: TemplateRef<any>;

  constructor(
    private router: Router,
    private tasksService: TasksService,

    private modalService: BsModalService
  ) {
    this.modalTitle = '';
    // this.modalTaskInput;
    this.modalTaskInput = {
      state: '',
      task: null
    };

    // this.modalTaskInput;
    this.modalTaskDetailInput = {
      state: '',
      task: null
    };
  }


  ngOnInit() {

    this.taskform = new Task();

  }
  AddChild(item: Task) {
    this.modalTaskInput.state = 'Child';
    this.modalTaskInput.task = item;
    this.taskModalRef = this.modalService.show(this.taskModal, { class: 'modal-lg' });
  }
  editTask(item: Task) {
    this.tasksService.openTasksModal({
      new: false,
      id: item._id,
    });
  }

  showTask(task: Task) {
    this.router.navigate(['/tasks', task._id]);
}
  onCancelModal(res: any) {
    this.taskModalRef.hide();
  }

  onSavedModal(task: Task) {
    this.taskModalRef.hide();
    if (this.modalTaskInput.state === 'Child') {
    /*if (task.parent !== 'none') {
      this.tasks.forEach(x => this.addToParent(task, x));
    } else {
      this.tasks.push(task);
    }*/
  }
  }
  onChangeModalTitle(title: string) {
    this.modalTitle = title;
  }
  addToParent(givenTask: Task, parent: Task) {
    if (givenTask.parentTask instanceof Task && givenTask.parentTask._id === parent._id) {
      parent.subTasks.push(givenTask);
    } else if (parent.subTasks.length > 0) {
      parent.subTasks.forEach(x => this.addToParent(givenTask, x));
    }

  }
  checkifchildsExists(taskid: string) {
    // return this.tasksService.subTaskMap.has(taskid);
  }

  toggleSubtasks(task: Task) {
    if (task.subTasks.length > 0) {
      task.expanded = !task.expanded;
    }

  }


  toggleTaskChecked(taskchecked: boolean) {

    return taskchecked = !taskchecked;
  }
  changecolor(task) {

    task.selected = !task.selected;
    if (task.selected) {
      task.selectedcolor = 'rgb(209, 209, 209)';
    } else {
      task.selectedcolor = '';
    }
  }
  AddtoSelectedTasklist(task: Task) {
    /*this.changecolor(task);
    let taskid = task._id;
    if (task.selected) {

      if (this.tasksService.selectedTaskList.indexOf(taskid) > -1) {
        if (!this.tasksService.selectedTaskList.includes(taskid)) {
          this.tasksService.selectedTaskList.push(taskid);
        } else {
          this.tasksService.selectedTaskList = this.tasksService.selectedTaskList.filter(function (a) {
            return a !== taskid;
          });
        }
      } else {
        this.tasksService.selectedTaskList.push(taskid);
      }
    } else {
      if (this.tasksService.selectedTaskList.includes(taskid)) {
        let index = this.tasksService.selectedTaskList.findIndex(a => {
          return taskid === a
        })
        this.tasksService.selectedTaskList.splice(index, 1);
      }

    }

*/
  }

  getColor(task: Task): String {
    this.colorofState = 'blue';

    return this.colorofState;
  }
}


