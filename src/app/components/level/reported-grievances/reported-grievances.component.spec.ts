import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportedGrievancesComponent } from './reported-grievances.component';

describe('ReportedGrievancesComponent', () => {
  let component: ReportedGrievancesComponent;
  let fixture: ComponentFixture<ReportedGrievancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportedGrievancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportedGrievancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
