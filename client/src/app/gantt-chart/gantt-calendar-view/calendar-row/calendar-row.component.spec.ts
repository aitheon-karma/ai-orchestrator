import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CalendarRowComponent } from './calendar-row.component';

describe('CalendarRowComponent', () => {
  let component: CalendarRowComponent;
  let fixture: ComponentFixture<CalendarRowComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CalendarRowComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CalendarRowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
