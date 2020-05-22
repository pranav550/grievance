import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceDashboardComponent } from './grievance-dashboard.component';

describe('GrievanceDashboardComponent', () => {
  let component: GrievanceDashboardComponent;
  let fixture: ComponentFixture<GrievanceDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
