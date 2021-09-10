import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttGridBodyComponent } from './gantt-grid-body.component';

describe('GanttGridBodyComponent', () => {
  let component: GanttGridBodyComponent;
  let fixture: ComponentFixture<GanttGridBodyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttGridBodyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttGridBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
