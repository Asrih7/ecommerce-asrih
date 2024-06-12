import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreSecondStepComponent } from './store-second-step.component';

describe('StoreSecondStepComponent', () => {
  let component: StoreSecondStepComponent;
  let fixture: ComponentFixture<StoreSecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreSecondStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoreSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
