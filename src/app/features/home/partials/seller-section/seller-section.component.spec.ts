import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerSectionComponent } from './seller-section.component';

describe('SellerSectionComponent', () => {
  let component: SellerSectionComponent;
  let fixture: ComponentFixture<SellerSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SellerSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SellerSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
