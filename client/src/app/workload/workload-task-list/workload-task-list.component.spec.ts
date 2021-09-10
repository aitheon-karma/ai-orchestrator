import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadTaskListComponent } from './workload-task-list.component';

describe('WorkloadTaskListComponent', () => {
  let component: WorkloadTaskListComponent;
  let fixture: ComponentFixture<WorkloadTaskListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkloadTaskListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkloadTaskListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
