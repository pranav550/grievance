import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EscalationMatrixComponent } from './escalation-matrix.component';

describe('EscalationMatrixComponent', () => {
  let component: EscalationMatrixComponent;
  let fixture: ComponentFixture<EscalationMatrixComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EscalationMatrixComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EscalationMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
