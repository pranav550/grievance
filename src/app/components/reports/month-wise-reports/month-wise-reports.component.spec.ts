import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthWiseReportsComponent } from './month-wise-reports.component';

describe('MonthWiseReportsComponent', () => {
  let component: MonthWiseReportsComponent;
  let fixture: ComponentFixture<MonthWiseReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthWiseReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthWiseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
