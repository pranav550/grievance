import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BeneficaryInstructionComponent } from './beneficary-instruction.component';

describe('BeneficaryInstructionComponent', () => {
  let component: BeneficaryInstructionComponent;
  let fixture: ComponentFixture<BeneficaryInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BeneficaryInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BeneficaryInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
