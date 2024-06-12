import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WalletSecondStepComponent } from './wallet-second-step.component';

describe('WalletSecondStepComponent', () => {
  let component: WalletSecondStepComponent;
  let fixture: ComponentFixture<WalletSecondStepComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WalletSecondStepComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WalletSecondStepComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
