import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressSecondStepComponent } from './address-second-step.component';

describe('AddressSecondStepComponent', () => {
  let component: AddressSecondStepComponent;
  let fixture: ComponentFixture<AddressSecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddressSecondStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
