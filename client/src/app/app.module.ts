import { NgModule } from '@angular/core';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CoreClientModule } from '@aitheon/core-client';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from '../environments/environment';
import { FormsModule } from '@angular/forms';
import { DashboardModule } from './dashboard/dashboard.module';
import { TasksModule } from './tasks/tasks.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { ProgressbarModule } from 'ngx-bootstrap/progressbar';
import { CalendarModule } from './calendar/calendar.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OrchestratorModule, Configuration, ConfigurationParameters } from '@aitheon/orchestrator';
import { HrModule } from '@aitheon/hr';
export function apiConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: '.'
  };
  return new Configuration(params);
}

export function apiHrConfigFactory(): Configuration {
  const params: ConfigurationParameters = {
    basePath: `${environment.production ? '' : environment.baseApi}/hr`
  };
  return new Configuration(params);
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    CoreClientModule.forRoot({
      baseApi: environment.baseApi,
      production: environment.production,
      service: environment.service
    }),
    AppRoutingModule,
    DashboardModule,
    TasksModule,
    FormsModule,
    CalendarModule,
    TabsModule.forRoot(),
    ButtonsModule.forRoot(),
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    ProgressbarModule.forRoot(),
    OrchestratorModule.forRoot(apiConfigFactory),
    HrModule.forRoot(apiHrConfigFactory)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
