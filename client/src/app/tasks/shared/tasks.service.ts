import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Task } from './task';
import { map } from 'rxjs/operators';
import { TasksRestService } from '@aitheon/orchestrator';
import { RestService } from '@aitheon/core-client';
import { environment } from '../../../environments/environment';

export interface ModalMeta {
  new: boolean;
  id?: string;
  parent?: string;
}


@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private _modal: BehaviorSubject<ModalMeta> = new BehaviorSubject(null);
  private _refresh: Subject<boolean> = new Subject();

  public readonly modal: Observable<ModalMeta> = this._modal.asObservable();
  public readonly refresh: Observable<boolean> = this._refresh.asObservable();
  constructor(
    private baseRestService: RestService,
    private restService: TasksRestService
  ) { }

  private ensureNoSircular(tasks: Task[], currentId: string) {
    const tasksMap: Map<string, Task> = new Map();
    for (const task of tasks) {
      tasksMap.set(task._id.toString(), task);
    }
    return tasks.filter((task: Task) => {
      let loopTaskId = task._id;
      const usedIds: string[] = [];
      while (loopTaskId && loopTaskId !== currentId && usedIds.indexOf(loopTaskId) === -1) {
        usedIds.push(loopTaskId);
        const temp = tasksMap.get(loopTaskId);
        loopTaskId = temp && temp.parentTask;
      }

      return !loopTaskId;
    });
  }

  openTasksModal(modalMeta: ModalMeta = null) {
    this._modal.next(modalMeta);
  }

  onTaskSave() {
    this.refreshTasks();
  }

  refreshTasks() {
    this._refresh.next(true);
  }

  list(settings: any = {}): Observable<Task[]> {
    const { parentsForId } = settings;
    let result = this.restService.list();

    if (parentsForId) {
      result = result.pipe(map((tasks: Task[] = []) => {
        return this.ensureNoSircular(tasks, parentsForId);
      }));
    }
    return result as Observable<Task[]>;
  }

  async isClockedIn(): Promise<boolean> {
    return this.baseRestService.fetch(`${environment.baseApi}/hr/api/tracker/time`, null, true).toPromise();
    // return this.baseRestService.fetch(`http://localhost:4000/api/tracker/time`, null, true).toPromise();
  }

  get(taskId: string): Observable<Task> {
    return this.restService.getById(taskId) as Observable<Task>;
  }

  remove(taskId: string): Observable<any> {
    return this.restService.remove(taskId) as Observable<any>;
  }

  create(task: Task): Observable<Task> {
    return this.restService.create(task as any) as Observable<Task>;
  }

  update(task: Task): Observable<Task> {
    return this.restService.update(task._id, task as any) as Observable<Task>;
  }
}
