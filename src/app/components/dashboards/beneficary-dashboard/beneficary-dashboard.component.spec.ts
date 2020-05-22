import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficaryDashboardComponent } from './beneficary-dashboard.component';

describe('BeneficaryDashboardComponent', () => {
  let component: BeneficaryDashboardComponent;
  let fixture: ComponentFixture<BeneficaryDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficaryDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
