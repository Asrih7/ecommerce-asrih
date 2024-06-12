import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqBuyerComponent } from './faq-buyer.component';

describe('FaqBuyerComponent', () => {
  let component: FaqBuyerComponent;
  let fixture: ComponentFixture<FaqBuyerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FaqBuyerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FaqBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
