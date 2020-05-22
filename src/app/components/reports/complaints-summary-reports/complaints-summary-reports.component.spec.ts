import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintsSummaryReportsComponent } from './complaints-summary-reports.component';

describe('ComplaintsSummaryReportsComponent', () => {
  let component: ComplaintsSummaryReportsComponent;
  let fixture: ComponentFixture<ComplaintsSummaryReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintsSummaryReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintsSummaryReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
