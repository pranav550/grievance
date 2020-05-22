import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceRegisterComponent } from './grievance-register.component';

describe('GrievanceRegisterComponent', () => {
  let component: GrievanceRegisterComponent;
  let fixture: ComponentFixture<GrievanceRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
