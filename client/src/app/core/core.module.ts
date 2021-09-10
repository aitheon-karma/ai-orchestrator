import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FileUploadComponent } from './file-upload/file-upload.component';
import { CoreClientModule } from '@aitheon/core-client';
import { GenericModalComponent } from './generic-modal/generic-modal.component';

@NgModule({
  declarations: [
    FileUploadComponent,
    GenericModalComponent,
  ],
  imports: [
    CoreClientModule,
    CommonModule
  ],
  exports: [
    FileUploadComponent,
    GenericModalComponent,
  ]
})
export class CoreModule { }
