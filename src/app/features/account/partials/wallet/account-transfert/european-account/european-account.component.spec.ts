import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EuropeanAccountComponent } from './european-account.component';

describe('EuropeanAccountComponent', () => {
  let component: EuropeanAccountComponent;
  let fixture: ComponentFixture<EuropeanAccountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EuropeanAccountComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EuropeanAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
