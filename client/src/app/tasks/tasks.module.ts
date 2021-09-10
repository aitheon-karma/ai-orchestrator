import { NgModule } from '@angular/core';
import { CoreClientModule } from '@aitheon/core-client';
import { TaskListComponent } from './task-list/task-list.component';
import { TaskRoutingModule } from './task-routing.module';
import { TaskDetailComponent } from './task-detail/task-detail.component';
import { TaskFormComponent } from './task-form/task-form.component';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { ContextMenuModule } from 'ngx-contextmenu';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { WidgetComponent} from './widget/widget.component';
import { TaskModalComponent } from './task-modal/task-modal.component';
import { CoreModule } from '../core/core.module';
import { TimerComponent } from './timer/timer.component';

@NgModule({
  imports: [
    CoreClientModule,
    TaskRoutingModule,
    TabsModule,
    ButtonsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule,
    BsDropdownModule.forRoot(),
    CollapseModule.forRoot(),
    ContextMenuModule.forRoot({
      useBootstrap4: true
    }),
    PopoverModule.forRoot(),
    TooltipModule.forRoot(),
    CoreModule,
  ],
  exports: [TaskListComponent, TaskFormComponent, WidgetComponent, TaskModalComponent],
  declarations: [ TaskListComponent, TaskDetailComponent, TaskFormComponent, WidgetComponent, TaskModalComponent, TimerComponent]
})
export class TasksModule {


 }
