import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreWishlistComponent } from './store-wishlist.component';

describe('StoreWishlistComponent', () => {
  let component: StoreWishlistComponent;
  let fixture: ComponentFixture<StoreWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoreWishlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
