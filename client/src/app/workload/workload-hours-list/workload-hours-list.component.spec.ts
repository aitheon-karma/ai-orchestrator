import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkloadHoursListComponent } from './workload-hours-list.component';

describe('WorkloadHoursListComponent', () => {
  let component: WorkloadHoursListComponent;
  let fixture: ComponentFixture<WorkloadHoursListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkloadHoursListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkloadHoursListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
