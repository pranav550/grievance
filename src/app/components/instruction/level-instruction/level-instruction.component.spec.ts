import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelInstructionComponent } from './level-instruction.component';

describe('LevelInstructionComponent', () => {
  let component: LevelInstructionComponent;
  let fixture: ComponentFixture<LevelInstructionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelInstructionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelInstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
