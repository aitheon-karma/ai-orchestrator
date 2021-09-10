import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskBoundariesComponent } from './task-boundaries.component';

describe('TaskBoundariesComponent', () => {
  let component: TaskBoundariesComponent;
  let fixture: ComponentFixture<TaskBoundariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaskBoundariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaskBoundariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
