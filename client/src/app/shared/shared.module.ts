import { NgModule } from '@angular/core';
import { MomentFormatPipe } from './pipes/moment-format.pipe';
import { SafeHtmlPipe } from './pipes/index';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from './pagination/pagination.component';



@NgModule({
  imports: [
    CommonModule,

  ],
  providers: [
  ],
  declarations: [
    MomentFormatPipe,
    SafeHtmlPipe,
    PaginationComponent
  ],
  exports: [
    MomentFormatPipe,
    SafeHtmlPipe,
    PaginationComponent
  ]
})
export class SharedModule { }
