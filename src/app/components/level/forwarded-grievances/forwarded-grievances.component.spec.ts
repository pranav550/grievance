import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwardedGrievancesComponent } from './forwarded-grievances.component';

describe('ForwardedGrievancesComponent', () => {
  let component: ForwardedGrievancesComponent;
  let fixture: ComponentFixture<ForwardedGrievancesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForwardedGrievancesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForwardedGrievancesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
