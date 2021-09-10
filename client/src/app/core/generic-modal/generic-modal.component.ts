import { TemplateRef, Component, OnInit, ViewChild, Output, Input, EventEmitter } from '@angular/core';
import { Document } from '@aitheon/core-client';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

export interface ModalData {
  text: string,
  payload: any,
}

@Component({
  selector: 'ai-generic-modal',
  templateUrl: './generic-modal.component.html',
  styleUrls: ['./generic-modal.component.scss']
})
export class GenericModalComponent implements OnInit {
  @Output() confirm: EventEmitter<Document> = new EventEmitter<Document>();
  @ViewChild('modal') formModal: TemplateRef<any>;

  data: ModalData;

  modalRef: BsModalRef;
  constructor(private modalService: BsModalService) {}

  ngOnInit() { }

  hide(){
    this.modalRef.hide();
  }

  onConfirm() {
    this.hide();
    this.confirm.emit(this.data.payload);
  }

  show(data: ModalData) {
    this.data = data;
    this.modalRef = this.modalService.show(this.formModal);
  }

  cancel() {
    this.modalRef.hide();
  }

}
