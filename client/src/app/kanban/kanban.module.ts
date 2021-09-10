import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { KanbanBoardComponent } from './kanban-board/kanban-board.component';
import { CoreClientModule } from '@aitheon/core-client';
import { NgDragDropModule } from 'ng-drag-drop';

@NgModule({
  declarations: [KanbanBoardComponent],
  imports: [
    CommonModule,
    CoreClientModule,
    NgDragDropModule.forRoot(),
  ],
  exports: [KanbanBoardComponent],
})
export class KanbanModule { }
