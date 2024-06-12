import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsSecondStepComponent } from './terms-second-step.component';

describe('TermsSecondStepComponent', () => {
  let component: TermsSecondStepComponent;
  let fixture: ComponentFixture<TermsSecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsSecondStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
