import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminForgotDetailsComponent } from './admin-forgot-details.component';

describe('AdminForgotDetailsComponent', () => {
  let component: AdminForgotDetailsComponent;
  let fixture: ComponentFixture<AdminForgotDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminForgotDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminForgotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
