import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DistrictWiseReportsComponent } from './district-wise-reports.component';

describe('DistrictWiseReportsComponent', () => {
  let component: DistrictWiseReportsComponent;
  let fixture: ComponentFixture<DistrictWiseReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DistrictWiseReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DistrictWiseReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
