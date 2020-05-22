import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceNatureComponent } from './grievance-nature.component';

describe('GrievanceNatureComponent', () => {
  let component: GrievanceNatureComponent;
  let fixture: ComponentFixture<GrievanceNatureComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceNatureComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceNatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
