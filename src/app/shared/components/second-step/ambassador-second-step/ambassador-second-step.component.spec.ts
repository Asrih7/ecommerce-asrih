import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AmbassadorSecondStepComponent } from './ambassador-second-step.component';

describe('AmbassadorSecondStepComponent', () => {
  let component: AmbassadorSecondStepComponent;
  let fixture: ComponentFixture<AmbassadorSecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AmbassadorSecondStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AmbassadorSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
