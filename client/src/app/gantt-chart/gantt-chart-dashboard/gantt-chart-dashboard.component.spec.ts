import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttChartDashboardComponent } from './gantt-chart-dashboard.component';

describe('GanttChartDashboardComponent', () => {
  let component: GanttChartDashboardComponent;
  let fixture: ComponentFixture<GanttChartDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttChartDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttChartDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
