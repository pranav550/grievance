import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TalukaSubDistrictsComponent } from './taluka-sub-districts.component';

describe('TalukaSubDistrictsComponent', () => {
  let component: TalukaSubDistrictsComponent;
  let fixture: ComponentFixture<TalukaSubDistrictsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TalukaSubDistrictsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TalukaSubDistrictsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
