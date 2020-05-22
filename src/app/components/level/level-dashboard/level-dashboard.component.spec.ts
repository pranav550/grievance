import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelDashboardComponent } from './level-dashboard.component';

describe('LevelDashboardComponent', () => {
  let component: LevelDashboardComponent;
  let fixture: ComponentFixture<LevelDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LevelDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LevelDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
