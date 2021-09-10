import { Component, TemplateRef, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { Task, RecurringSetting, TasksService, TaskType, ModalMeta } from '../../tasks/shared';

@Component({
  selector: 'ai-task-modal',
  templateUrl: './task-modal.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./task-modal.component.scss']
})
export class TaskModalComponent implements OnDestroy {
  private modal$;

  @ViewChild('template') templateRef: TemplateRef<any>;
  modalRef: BsModalRef;
  config = {
    class: 'task-modal'
  };
  modalMeta: ModalMeta;

  constructor(
    private tasksService: TasksService,
    private modalService: BsModalService
  ) {}

  ngAfterViewInit() {
    this.modal$ = this.tasksService.modal.subscribe((modalMeta: ModalMeta) => {
      if (modalMeta) {
        this.modalMeta = modalMeta;
        this.openModal(this.templateRef);
      }
    });
  }

  onCancelModal(event: any) {
    this.modalRef.hide();
  }

  onSaveModal(event: any) {
    this.tasksService.onTaskSave();
    this.modalRef.hide();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, this.config);
  }

  ngOnDestroy() {
    this.modal$.unsubscribe();
  }

}
