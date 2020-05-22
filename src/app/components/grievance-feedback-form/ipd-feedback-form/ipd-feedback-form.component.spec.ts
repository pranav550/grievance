import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IpdFeedbackFormComponent } from './ipd-feedback-form.component';

describe('IpdFeedbackFormComponent', () => {
  let component: IpdFeedbackFormComponent;
  let fixture: ComponentFixture<IpdFeedbackFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IpdFeedbackFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IpdFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
