import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressOtherComponent } from './adress-other.component';

describe('AdressOtherComponent', () => {
  let component: AdressOtherComponent;
  let fixture: ComponentFixture<AdressOtherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdressOtherComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdressOtherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
