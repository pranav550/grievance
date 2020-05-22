import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintTypeReportsComponent } from './complaint-type-reports.component';

describe('ComplaintTypeReportsComponent', () => {
  let component: ComplaintTypeReportsComponent;
  let fixture: ComponentFixture<ComplaintTypeReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintTypeReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintTypeReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
