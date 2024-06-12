import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewProductsSectionComponent } from './new-products-section.component';

describe('NewProductsSectionComponent', () => {
  let component: NewProductsSectionComponent;
  let fixture: ComponentFixture<NewProductsSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewProductsSectionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewProductsSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
