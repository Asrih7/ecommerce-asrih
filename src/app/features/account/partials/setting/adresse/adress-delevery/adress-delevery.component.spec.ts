import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdressDeleveryComponent } from './adress-delevery.component';

describe('AdressDeleveryComponent', () => {
  let component: AdressDeleveryComponent;
  let fixture: ComponentFixture<AdressDeleveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdressDeleveryComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdressDeleveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
