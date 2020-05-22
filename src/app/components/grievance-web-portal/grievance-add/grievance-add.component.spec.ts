import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GrievanceAddComponent } from './grievance-add.component';

describe('GrievanceAddComponent', () => {
  let component: GrievanceAddComponent;
  let fixture: ComponentFixture<GrievanceAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GrievanceAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GrievanceAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
