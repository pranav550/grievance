import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NatureComplaintReportsComponent } from './nature-complaint-reports.component';

describe('NatureComplaintReportsComponent', () => {
  let component: NatureComplaintReportsComponent;
  let fixture: ComponentFixture<NatureComplaintReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NatureComplaintReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NatureComplaintReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
