import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayBoundariesComponent } from './day-boundaries.component';

describe('DayBoundariesComponent', () => {
  let component: DayBoundariesComponent;
  let fixture: ComponentFixture<DayBoundariesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayBoundariesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayBoundariesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
