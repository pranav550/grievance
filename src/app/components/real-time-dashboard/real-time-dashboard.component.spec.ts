import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealTimeDashboardComponent } from './real-time-dashboard.component';

describe('RealTimeDashboardComponent', () => {
  let component: RealTimeDashboardComponent;
  let fixture: ComponentFixture<RealTimeDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealTimeDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealTimeDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
