import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarSmallComponent } from './calendar-small.component';

describe('CalendarSmallComponent', () => {
  let component: CalendarSmallComponent;
  let fixture: ComponentFixture<CalendarSmallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarSmallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarSmallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
