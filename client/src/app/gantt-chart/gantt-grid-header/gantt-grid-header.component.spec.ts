import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GanttGridHeaderComponent } from './gantt-grid-header.component';

describe('GanttGridHeaderComponent', () => {
  let component: GanttGridHeaderComponent;
  let fixture: ComponentFixture<GanttGridHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GanttGridHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GanttGridHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
