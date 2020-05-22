import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWiseReportComponent } from './block-wise-report.component';

describe('BlockWiseReportComponent', () => {
  let component: BlockWiseReportComponent;
  let fixture: ComponentFixture<BlockWiseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockWiseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockWiseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
