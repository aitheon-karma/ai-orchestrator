import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttCalendarViewComponent } from './gantt-calendar-view.component';

describe('GanttCalendarViewComponent', () => {
  let component: GanttCalendarViewComponent;
  let fixture: ComponentFixture<GanttCalendarViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttCalendarViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttCalendarViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
