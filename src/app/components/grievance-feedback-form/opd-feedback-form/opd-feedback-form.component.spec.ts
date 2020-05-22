import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpdFeedbackFormComponent } from './opd-feedback-form.component';

describe('OpdFeedbackFormComponent', () => {
  let component: OpdFeedbackFormComponent;
  let fixture: ComponentFixture<OpdFeedbackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpdFeedbackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpdFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
