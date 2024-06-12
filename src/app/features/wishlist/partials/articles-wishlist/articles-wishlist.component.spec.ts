import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticlesWishlistComponent } from './articles-wishlist.component';

describe('ArticlesWishlistComponent', () => {
  let component: ArticlesWishlistComponent;
  let fixture: ComponentFixture<ArticlesWishlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ArticlesWishlistComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArticlesWishlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
