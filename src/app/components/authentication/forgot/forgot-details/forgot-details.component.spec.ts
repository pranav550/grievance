import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ForgotDetailsComponent } from './forgot-details.component';

describe('ForgotDetailsComponent', () => {
  let component: ForgotDetailsComponent;
  let fixture: ComponentFixture<ForgotDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ForgotDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
